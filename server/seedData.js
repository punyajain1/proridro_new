import fs from 'fs';
import path from 'path';
import mongoose from "mongoose";
import "dotenv/config";
import connectDB from "./configs/db.js";
import Car from "./models/Car.js";
import Addon from "./models/Addon.js";
import Airport from "./models/Airport.js";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const parseCsv = (csvText) => {
    const lines = csvText.split(/\r?\n/);
    if (lines.length < 2) return [];

    const headers = lines[0].split(",").map(h => h.trim());
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

    let category = item.category ? item.category.trim() : "Sedan";

    let seatingCapacity = 4;
    let seatingStr = item.seating ? String(item.seating).trim() : "4";
    if (seatingStr) {
        const seatMatches = seatingStr.match(/\d+/g);
        if (seatMatches && seatMatches.length > 0) {
            seatingCapacity = parseInt(seatMatches[seatMatches.length - 1], 10);
        }
    }

    let luggageStr = item.luggage ? String(item.luggage).trim() : "3 medium + 2 small";
    let baggageCapacity = 2;
    const luggageMatch = luggageStr.match(/\d+/);
    if (luggageMatch) {
        baggageCapacity = parseInt(luggageMatch[0], 10);
    }

    let fuel_type = "Petrol";
    let transmission = "Automatic";

    const nameLower = fullName.toLowerCase();
    const catLower = category.toLowerCase();
    if (nameLower.includes("electric") || nameLower.includes("ev") || catLower.includes("electric")) {
        fuel_type = "Electric";
    } else if (nameLower.includes("diesel") || catLower.includes("bus") || catLower.includes("van") || brand.toLowerCase() === "volvo") {
        fuel_type = "Diesel";
    } else if (nameLower.includes("hybrid")) {
        fuel_type = "Hybrid";
    } else if (nameLower.includes("cng")) {
        fuel_type = "CNG / Petrol";
    }

    if (catLower.includes("bus") || catLower.includes("tempo")) {
        transmission = "Manual";
    }

    const parseNum = (val, defaultVal = 0) => {
        if (!val || val === "#REF!" || isNaN(val)) return defaultVal;
        const cleaned = String(val).replace(/[^0-9.]/g, '');
        const parsed = parseFloat(cleaned);
        return isNaN(parsed) ? defaultVal : parsed;
    };

    const airportBasePrice = parseNum(item.airport_base_price, 3870);
    const cityBasePrice1 = parseNum(item.city_base_price_1, 3800);
    const cityBasePrice2 = parseNum(item.city_base_price_2, 4720);
    const cityBasePrice3 = parseNum(item.city_base_price_3, 5640);
    const cityFullDayPrice = parseNum(item.city_full_day_price, 6900);
    const outstationBasePrice = parseNum(item.outstation_base_price, 6900);
    const startingFrom = parseNum(item['starting from'] || item.airport_base_price, 3799);

    const extraKmRate = parseNum(item.extra_km_rate, 23);
    const extraHourRate = parseNum(item.extra_hour_rate, 230);
    const waitingPerHour = parseNum(item.waiting_per_hour, 230);
    const driverAllowanceDay = parseNum(item.driver_allowance_day, 600);
    const driverAllowanceNight = parseNum(item.driver_allowance_night, 600);

    const airportIncludedKm = parseNum(item.airport_included_km, 50);
    const airportIncludedHours = parseNum(item.airport_included_hours, 2);
    const cityIncludedKm1 = parseNum(item.city_included_km_1, 80);
    const cityIncludedHours1 = parseNum(item.city_included_hours_1, 8);
    const cityIncludedKm2 = parseNum(item.city_included_km_2, 100);
    const cityIncludedHours2 = parseNum(item.city_included_hours_2, 10);
    const cityIncludedKm3 = parseNum(item.city_included_km_3, 120);
    const cityIncludedHours3 = parseNum(item.city_included_hours_3, 12);
    const cityFullDayKm = parseNum(item.city_full_day_km, 300);
    const outstationIncludedKm = parseNum(item.outstation_included_km, 300);
    const outstationIncludedHours = parseNum(item.outstation_included_hours, 24);

    const includes = item.includes ? item.includes.split(",").map(f => f.replace(/"/g, '').trim()).filter(Boolean) : ["Driver Charges", "Fuel"];
    const excludes = item.excludes ? item.excludes.split(",").map(f => f.replace(/"/g, '').trim()).filter(Boolean) : ["Toll", "Parking Charges", "State Permit", "Taxes"];

    return {
        id: item.id ? parseInt(item.id) : 0,
        brand: brand,
        model: model,
        name: fullName,
        image: item.image || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=800",
        year: 2024,
        category: category,
        seating: seatingStr,
        seating_capacity: seatingCapacity,
        luggage: luggageStr,
        baggage_capacity: baggageCapacity,
        fuel_type: fuel_type,
        transmission: transmission,
        
        pricePerDay: startingFrom,
        pricePerKm: extraKmRate,
        baseFare: airportBasePrice,
        starting_from: startingFrom,
        product_url: item.product_url || "",

        airport_base_price: airportBasePrice,
        city_base_price_1: cityBasePrice1,
        city_base_price_2: cityBasePrice2,
        city_base_price_3: cityBasePrice3,
        city_full_day_price: cityFullDayPrice,
        outstation_base_price: outstationBasePrice,

        extra_km_rate: extraKmRate,
        extra_hour_rate: extraHourRate,
        waiting_per_hour: waitingPerHour,
        driver_allowance_day: driverAllowanceDay,
        driver_allowance_night: driverAllowanceNight,

        airport_included_km: airportIncludedKm,
        airport_included_hours: airportIncludedHours,
        city_included_km_1: cityIncludedKm1,
        city_included_hours_1: cityIncludedHours1,
        city_included_km_2: cityIncludedKm2,
        city_included_hours_2: cityIncludedHours2,
        city_included_km_3: cityIncludedKm3,
        city_included_hours_3: cityIncludedHours3,
        city_full_day_km: cityFullDayKm,
        outstation_included_km: outstationIncludedKm,
        outstation_included_hours: outstationIncludedHours,

        includes: includes.join(', '),
        excludes: excludes.join(', '),
        isAvaliable: true
    };
};

const seedData = async () => {
    try {
        await connectDB();
        console.log("Connected to MongoDB for seeding...");

        // Seed Addons
        const addonCsv = fs.readFileSync(path.join(__dirname, 'data', 'addon - Sheet1.csv'), 'utf8');
        const addonRows = parseCsv(addonCsv);
        await Addon.deleteMany({});
        try { await Addon.collection.dropIndexes(); } catch(e) {}
        const addons = addonRows.map(row => ({
            id: parseInt(row.id),
            name: row.name,
            type: row.type,
            option: row.option,
            price: parseInt(row.price) || 0
        }));
        await Addon.insertMany(addons);
        console.log(`Inserted ${addons.length} addons.`);

        // Seed Airports
        const airportCsv = fs.readFileSync(path.join(__dirname, 'data', 'airport - Sheet1.csv'), 'utf8');
        const airportRows = parseCsv(airportCsv);
        await Airport.deleteMany({});
        const airports = airportRows.map(row => ({
            id: parseInt(row.id),
            name: row.name,
            city: row.city,
            state: row.state,
            terminal: row.terminal,
            parking_charge_30: parseInt(row.parking_charge_30) || 0,
            parking_charge_1: parseInt(row.parking_charge_1) || 0,
            parking_charge_2: parseInt(row.parking_charge_2) || 0,
            parking_charge_4: parseInt(row.parking_charge_4) || 0,
            entry_fee: parseInt(row.entry_fee) || 0,
            free_wait: parseInt(row.free_wait) || 0,
            overstay_penalty: parseInt(row.overstay_penalty) || 0,
            toll_bus_30m: parseInt(row.toll_bus_30m) || 0,
            toll_car: parseInt(row.toll_car) || 0
        }));
        await Airport.insertMany(airports);
        console.log(`Inserted ${airports.length} airports.`);

        // Seed Cars (Fleet)
        const fleetCsv = fs.readFileSync(path.join(__dirname, 'data', 'fleet - Sheet1.csv'), 'utf8');
        const fleetRows = parseCsv(fleetCsv);
        await Car.deleteMany({});
        const cars = fleetRows.map(row => formatCarDocument(row));
        await Car.insertMany(cars);
        console.log(`Inserted ${cars.length} cars.`);

        process.exit(0);
    } catch (error) {
        console.error("Seeding error:", error);
        process.exit(1);
    }
};

seedData();
