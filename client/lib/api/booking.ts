import { Booking, BookingStatus, PaymentStatus } from "./types";
import { apiFetch, API_URL } from "./fetcher";

const mapServerBookingToClient = (b: any): Booking => {
  let finalPickup = b.rawPayload?.user_pickupAddress || b.rawPayload?.pickup_address || b.pickupCity || "";
  let finalDrop = b.rawPayload?.user_dropAddress || b.rawPayload?.drop_address || b.dropAddress || "";

  if (b.transferType === "drop") {
    finalDrop = b.airportName ? `${b.airportName}${b.airportTerminal ? ` (${b.airportTerminal})` : ''}` : finalDrop;
  } else if (b.transferType === "pickup") {
    finalPickup = b.airportName ? `${b.airportName}${b.airportTerminal ? ` (${b.airportTerminal})` : ''}` : finalPickup;
  }

  return {
    ...b,
    id: b.bookingId || b._id,
    customer: {
      name: b.fullName,
      phone: b.phone,
      email: b.emailAddress
    },
    vehicleType: b.carName,
    pickup: finalPickup,
    drop: finalDrop,
    travelDate: b.pickupDate || b.rawPayload?.pickup_date || "",
    travelTime: b.pickupTime || b.rawPayload?.pickup_time || "",
    amount: b.totalAmount,
    createdAt: b.createdAt,
    updatedAt: b.updatedAt,
    // Provide a dummy timeline since the backend doesn't store timeline events yet
    timeline: [
      {
        title: "Booking Created",
        description: `Booking for ${b.fullName}`,
        timestamp: new Date(b.createdAt || Date.now()).toISOString().substring(0, 16).replace("T", " "),
        user: "System",
      }
    ]
  };
};

export async function getBookings(): Promise<Booking[]> {
  try {
    const res = await apiFetch(`${API_URL}/bookings/owner`, { cache: 'no-store' });
    const data = await res.json();
    if (data.success) {
      return data.bookings.map(mapServerBookingToClient);
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch bookings from server", error);
    return [];
  }
}

export async function getBookingById(id: string): Promise<Booking | null> {
  try {
    // We try to match with bookingId if it matches PRD format, else fallback
    const res = await apiFetch(`${API_URL}/bookings/owner`, { cache: 'no-store' });
    const data = await res.json();
    if (data.success) {
      const b = data.bookings.find((bk: any) => bk.bookingId === id || bk._id === id);
      return b ? mapServerBookingToClient(b) : null;
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch booking", error);
    return null;
  }
}

export async function createBooking(data: any): Promise<Booking> {
  throw new Error("createBooking not fully mapped to backend yet");
}

export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus,
  notes?: string
): Promise<Booking> {
  try {
    // Convert status to one of the backend allowed values if necessary
    let serverStatus = status;
    if (["Assigned", "Driver Assigned", "Trip Started"].includes(status)) {
        serverStatus = "Confirmed" as any;
    }

    // Backend expects mongo _id for bookingId, we need to fetch the _id first
    // Or we modify the backend to accept `bookingId` field. 
    // Since we didn't change the backend to accept string `bookingId` in changeBookingStatus (it uses findById which expects ObjectId),
    // let's fetch all and find the ObjectId
    const all = await getBookings();
    const target = all.find(b => b.id === bookingId);
    
    if (!target) throw new Error("Booking not found");
    const mongoId = (target as any)._id || target.id; // Usually mapped above, but let's assume we can fetch it

    const res = await apiFetch(`${API_URL}/bookings/change-status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookingId: mongoId, // needs to be mongo ObjectId for the backend
        status: serverStatus
      })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    
    return { ...target, status: serverStatus } as Booking;
  } catch (error) {
    console.error("Status update failed", error);
    throw error;
  }
}

export async function updatePaymentStatus(
  bookingId: string,
  paymentStatus: PaymentStatus,
  transactionId?: string
): Promise<Booking> {
  try {
    const all = await getBookings();
    const target = all.find(b => b.id === bookingId);
    if (!target) throw new Error("Booking not found");
    const mongoId = (target as any)._id || target.id;

    const res = await apiFetch(`${API_URL}/bookings/change-status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookingId: mongoId,
        paymentStatus
      })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);

    return { ...target, paymentStatus } as Booking;
  } catch (error) {
    console.error("Payment status update failed", error);
    throw error;
  }
}
