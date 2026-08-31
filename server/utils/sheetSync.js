import https from "https";
import Car from "../models/Car.js";

const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/1iA_KcPUFCO1OmtfJKK_d3u3hOXLF4sOgKWp4gjhkHDM/export?format=csv&gid=0";

const fetchCsv = (url) => {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                return resolve(fetchCsv(res.headers.location));
            }
            let data = "";
            res.on("data", (chunk) => (data += chunk));
            res.on("end", () => resolve(data));
        }).on("error", (err) => reject(err));
    });
};

const parseCsv = (csv) => {
    const lines = csv.trim().split("\n");
    if (!lines.length) return [];

    const headers = lines[0].split(",");
    const rows = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) continue;

        const values = [];
        let current = "";
        let inQuotes = false;

        for (let j = 0; j < line.length; j++) {
            const char = line[j];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                values.push(current.trim());
                current = "";
            } else {
                current += char;
            }
        }
        values.push(current.trim());

        const row = {};
        headers.forEach((h, idx) => {
            row[h.trim()] = values[idx] || "";
        });
        rows.push(row);
    }
    return rows;
};

const formatCarDocument = (item) => {
    let brand = item.brand ? item.brand.trim() : "GoRido";
    let fullName = item.name ? item.name.trim() : "";
    let model = fullName;

    if (brand && fullName.toLowerCase().startsWith(brand.toLowerCase())) {
        model = fullName.slice(brand.length).trim();
    }
    if (!model) model = fullName || brand;

    // Normalizing category
    let category = item.category || "Sedan";
    if (category.toLowerCase().includes("electric") && category.toLowerCase().includes("bus")) {
        category = "Bus";
    } else if (category.toLowerCase().includes("sports") || category.toLowerCase().includes("convertible")) {
        category = "Luxury";
    } else if (category.toLowerCase().includes("van")) {
        category = "Tempo";
    } else if (category.toLowerCase().includes("electric")) {
        category = "Electric";
    }

    // Seating capacity
    let seating = 4;
    if (item.seating) {
        const seatMatches = item.seating.match(/\d+/g);
        if (seatMatches && seatMatches.length > 0) {
            seating = parseInt(seatMatches[seatMatches.length - 1], 10);
        }
    }

    // Baggage capacity
    let baggage = 2;
    if (item.luggage) {
        const luggageMatch = item.luggage.match(/\d+/);
        if (luggageMatch) {
            baggage = parseInt(luggageMatch[0], 10);
        }
    }

    // Fuel Type & Transmission
    let fuel_type = "Petrol";
    let transmission = "Automatic";

    const nameLower = fullName.toLowerCase();
    if (nameLower.includes("electric") || nameLower.includes("ev") || category === "Electric") {
        fuel_type = "Electric";
    } else if (nameLower.includes("diesel") || category === "Bus" || category === "Tempo" || brand.toLowerCase() === "volvo") {
        fuel_type = "Diesel";
    } else if (nameLower.includes("hybrid")) {
        fuel_type = "Hybrid";
    } else if (nameLower.includes("cng")) {
        fuel_type = "CNG / Petrol";
    }

    if (category === "Bus" || category === "Tempo") {
        transmission = "Manual";
    }

    // Direct Image URL from Google Sheet column
    const image = item.image && item.image.startsWith("http")
        ? item.image.trim()
        : "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=800";

    // Pricing
    const startingFrom = parseInt(item['starting from'] || item.city_base_price_1 || '4999', 10);
    const pricePerDay = isNaN(startingFrom) ? 4999 : startingFrom;
    const pricePerKm = parseInt(item.extra_km_rate || '14', 10) || 14;
    const baseFare = parseInt(item.outstation_base_price || item.airport_base_price || '500', 10) || 500;

    // Features
    const includes = item.includes ? item.includes.split(",").map(f => f.replace(/"/g, '').trim()) : [];
    const features = Array.from(new Set([
        ...includes,
        "Air Conditioning",
        "Verified Professional Driver",
        "24/7 Roadside Assistance",
        "Clean & Sanitized Interiors"
    ])).filter(Boolean);

    const indianCities = [
        "Mumbai", "Delhi NCR", "Bengaluru", "Hyderabad", "Chennai", "Kolkata", 
        "Pune", "Ahmedabad", "Jaipur", "Chandigarh", "Lucknow", "Goa", "Indore"
    ];
    const location = indianCities[parseInt(item.id || "0", 10) % indianCities.length];

    return {
        brand: brand,
        model: model,
        image: image,
        year: 2024,
        category: category,
        seating_capacity: seating,
        baggage_capacity: baggage,
        fuel_type: fuel_type,
        transmission: transmission,
        pricePerDay: pricePerDay,
        pricePerKm: pricePerKm,
        baseFare: baseFare,
        location: location,
        description: `Premium ${fullName} available for airport transfers, outstation travel, and local hourly rentals in India. Includes ${includes.join(', ') || 'verified driver and fuel'}.`,
        features: features,
        isAvaliable: true
    };
};

export const syncFleetFromGoogleSheet = async () => {
    try {
        console.log("Fetching live fleet from Google Sheet...");
        const csvRaw = await fetchCsv(GOOGLE_SHEET_CSV_URL);
        const parsedRows = parseCsv(csvRaw);
        
        if (!parsedRows || parsedRows.length === 0) {
            throw new Error("No vehicle rows found in Google Sheet");
        }

        const carDocuments = parsedRows.map(formatCarDocument);

        await Car.deleteMany({});
        const inserted = await Car.insertMany(carDocuments);
        console.log(`Synced ${inserted.length} vehicles directly from Google Sheet into MongoDB!`);
        return { success: true, count: inserted.length };
    } catch (error) {
        console.error("syncFleetFromGoogleSheet error:", error.message);
        return { success: false, message: error.message };
    }
};
