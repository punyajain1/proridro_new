import mongoose from "mongoose";
import "dotenv/config";
import connectDB from "./configs/db.js";
import Car from "./models/Car.js";

const csvData = `id,name,category,brand,seating,luggage,airport_base_price,city_base_price_1,city_base_price_2,city_base_price_3,city_full_day_price,outstation_base_price,driver_allowance_day,driver_allowance_night,extra_hour_rate,extra_km_rate,waiting_per_hour,airport_included_km,airport_included_hours,city_included_km_1,city_included_hours_1,city_included_km_2,city_included_hours_2,city_included_km_3,city_included_hours_3,city_full_day_km,outstation_included_km,outstation_included_hours,includes,excludes,image,starting from,product_url
27,Rolls Royce (Under 3 Years),Sedan,Rolls Royce,4,3 medium + 3 small,210700,265000,303000,339000,375000,180000,2000,2000,6500,1250,6000,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/RollsRoyce.webp,179999,https://www.prorido.com/product/rolls-royce/
96,Rolls Royce (3+ Years),Sedan,Rolls Royce,4,3 medium + 3 small,65770,65000,89000,113000,#REF!,180000,2000,2000,6000,600,6000,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/RollsRoyce.webp,64999,https://www.prorido.com/product/rolls-royce-ghost/
28,Lexus LX 570,SUV,Lexus,"6,7",5 medium + 5 small,85770,85000,117000,149000,240000,240000,2000,2000,8000,800,8000,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/LexusLX570.webp,84999,https://www.prorido.com/product/lexus-lx-570/
22,Range Rover Evoque,SUV,Range Rover,4,4 medium + 3 small,53270,52500,71500,90500,142500,142500,1500,1500,4750,475,4750,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/RangeRoverEvoque.webp,52499,https://www.prorido.com/product/range-rover-evoque/
23,Range Rover Velar,SUV,Range Rover,4,4 medium + 4 small,50770,50000,68000,86000,135000,135000,1500,1500,4500,450,4500,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/RangeRoverVelar.webp,49999,https://www.prorido.com/product/range-rover-velar/
26,Mercedes G 400 Wagon,SUV,Mercedes,4,4 medium + 4 small,50770,50000,68000,86000,135000,135000,1500,1500,4500,450,4500,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/MercedesG400Wagon.png,49999,https://www.prorido.com/product/mercedes-g-wagon-400/
24,Range Rover Sport,SUV,Range Rover,4,5 medium + 4 small,48270,47500,64500,81500,127500,127500,1500,1500,4250,425,4250,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/RangeRoverSport.webp,47499,https://www.prorido.com/product/range-rover-sport/
47,Toyota Alphard,VAN,Toyota,"6,7",4 medium + 4 small,47770,47000,63800,80600,126000,126000,2000,2000,4200,420,4200,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/ToyotaAlphard.webp,46999,https://www.prorido.com/product/toyota-alphard/
25,Land Rover Defender,SUV,Land Rover,4,5 medium + 4 small,45770,45000,61000,77000,120000,120000,1500,1500,4000,400,4000,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/LandRoverDefender.webp,44999,https://www.prorido.com/product/land-rover-defender/
29,Mercedes Benz Maybach,Sedan,Mercedes,4,4 medium + 3 small,40770,65000,91000,103000,195000,90000,1500,1500,6500,650,3000,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/MercedesBenzMaybach.png,40769,https://www.prorido.com/product/mercedes-benz-maybach/
32,Mercedes GLS 450,SUV,Mercedes,"5,6",5 medium + 5 small,38770,38000,50000,62000,90000,90000,1000,1000,3000,300,3000,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2025/05/MercedesGLS450.png,37999,https://www.prorido.com/product/mercedes-gls-450/
48,Toyota Vellfire,VAN,Toyota,"6,7",4 medium + 4 small,37770,37000,49800,62600,96000,96000,2000,2000,3200,320,3200,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/ToyotaVellfire.webp,36999,https://www.prorido.com/product/toyota-vellfire/
95,MG M9,VAN,MG,4,4 medium + 4 small,37770,37000,49800,62600,96000,96000,2000,2000,3200,320,3200,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/MGM9_F3QV.png,36999,https://www.prorido.com/product/mg-m9/
30,Land Cruiser V8,SUV,Land Cruiser,"6,7",5 medium + 5 small,35770,35000,47000,59000,90000,90000,1500,1500,3000,300,3000,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/LandCruiserV8.webp,34999,https://www.prorido.com/product/land-cruiser-v8/
33,Audi Q8,SUV,Audi,4,4 medium + 4 small,35770,35000,47000,59000,90000,90000,1000,1000,3000,300,3000,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/AudiQ8.png,34999,https://www.prorido.com/product/audi-q8/
39,BMW X7,SUV,BMW,6,4 medium + 4 small,35770,35000,47000,59000,90000,90000,1000,1000,3000,300,3000,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2025/05/BMWX7.png,34999,https://www.prorido.com/product/bmw-x7/
44,Mercedes EQS S,Electric,Mercedes,4,4 medium + 3 small,35770,35000,47000,59000,90000,90000,2000,2000,3000,300,3000,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2025/05/MercedesEQS-1.png,34999,https://www.prorido.com/product/mercedes-eqs-s/
45,BMW i7 EV,Electric,BMW,4,3 medium + 3 small,35770,35000,47000,59000,90000,90000,2000,2000,3000,300,3000,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/BMW_i7_EV.png,34999,https://www.prorido.com/product/bmw-ev/
87,Olectra X2,Electric Bus,Olectra,34,15+ large total,35000,40000,56000,72000,120000,120000,1500,1500,4000,400,4000,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/Olectra-X2-35-Seater-Under-Electric_F3QV-1.png,34999,https://www.prorido.com/product/olectra-x2/
31,Mercedes GLS 350,SUV,Mercedes,"5,6",5 medium + 5 small,32770,32000,44000,56000,90000,90000,1000,1000,3000,300,3000,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/MercedesGLS350.webp,31999,https://www.prorido.com/product/mercedes-gls-suv/
38,BMW X5,SUV,BMW,4,4 medium + 4 small,32770,32000,44000,56000,90000,90000,1000,1000,3000,300,3000,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/BMW_X5.png,31999,https://www.prorido.com/product/bmw-x5/
78,MG Cyberster,Sports Car,MG,1,2 medium + 3 small,32000,37000,51800,66600,111000,111000,1500,1500,3700,370,3700,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/MGCyberster.png,31999,https://www.prorido.com/product/mg-cyberster/
79,Porshe 718 Cayman,Sports Car,Porshe,1,2 medium + 3 small,32000,37000,51800,66600,111000,111000,1500,1500,3700,370,3700,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/Porshe_718_Cayman.png,31999,https://www.prorido.com/product/porshe-718-cayman/
36,Mercedes S Class,Sedan,Mercedes,4,3 medium + 2 small,30770,30000,42000,54000,90000,90000,1000,1000,3000,300,3000,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/MercedesSclass.webp,29999,https://www.prorido.com/product/mercedes-s-class/
37,BMW 7 Series,Sedan,BMW,4,3 medium + 2 small,30770,30000,42000,54000,90000,90000,1000,1000,3000,300,3000,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/BMW_7S.png,29999,https://www.prorido.com/product/bmw-7-series/
49,Mercedes V Class,VAN,Mercedes,"6,7",2 medium + 3 small,28770,28000,37200,46400,69000,69000,1500,1500,2300,230,2300,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2025/05/MercedesVClass-1.png,27999,https://www.prorido.com/product/mercedes-v-class/
21,Mercedes GLE,SUV,Mercedes,"4,6",4 medium + 4 small,28270,27500,38700,49900,84000,84000,1000,1000,2800,280,2800,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/MercedesGLE.png,27499,https://www.prorido.com/product/mercedes-gle-suv/
66,Premium Bus 45 Seater,Bus,Bus,44,18+ large total,26270,25500,29500,33500,30000,30000,2000,2000,1000,100,1000,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/PremiumBus45Seater.webp,25499,https://www.prorido.com/product/premium-bus-45-seater/
34,Audi Q7,SUV,Audi,6,4 medium + 4 small,25770,25000,37000,49000,90000,90000,1000,1000,3000,300,3000,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2025/05/AudiQ7-1.png,24999,https://www.prorido.com/product/audi-q7/
35,Maserati Quattroporte,Sedan,Maserati,4,3 medium + 2 small,25770,25000,33400,41800,63000,63000,1000,1000,2100,210,2100,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2025/05/MaseratiQuattroporte.png,24999,https://www.prorido.com/product/maserati-quattroporte/
68,Premium Bus 40 Seater,Bus,Bus,39,16+ large total,25270,24500,28100,31700,27000,27000,2000,2000,900,90,900,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/PremiumBus40Seater.webp,24499,https://www.prorido.com/product/premium-bus-40-seater/
64,Volvo Bus 45 Seater,Bus,Volvo,44,18+ large total,24770,24000,28800,33600,36000,36000,2000,2000,1200,120,1200,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/Volvobus45Seater.webp,23999,https://www.prorido.com/product/volvo-bus-45-seater/
67,Coach 45 Seater,Bus,Bus,44,18+ large total,24270,23500,27100,30700,27000,27000,2000,2000,900,90,900,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/Coach45Seater.png,23499,https://www.prorido.com/product/coach-45-seater/
40,Audi A7,Sedan,Audi,4,3 medium + 2 small,23770,23000,31400,39800,63000,63000,1000,1000,2100,210,2100,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2025/05/AudiA7_F3QV.png,22999,https://www.prorido.com/product/audi-a7/
70,Coach 40 Seater,Bus,Bus,39,16+ large total,23270,22500,25500,28500,22500,22500,2000,2000,750,75,750,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/Coach40Seater.png,22499,https://www.prorido.com/product/coach-40-seater/
42,Audi Q5,SUV,Audi,4,4 medium + 3 small,21770,21000,29000,37000,60000,60000,1000,1000,2000,200,2000,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2025/05/AudiQ5-1.png,20999,https://www.prorido.com/product/audi-q5/
41,BMW 6 Series,Sedan,BMW,4,3 medium + 2 small,20770,20000,28000,36000,60000,60000,1000,1000,2000,200,2000,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2025/05/BMW6Series.png,19999,https://www.prorido.com/product/bmw-6-series/
17,BMW 5 Series,Sedan,BMW,4,3 medium + 2 small,19770,19000,26000,33000,52500,52500,1000,1000,1750,175,1750,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2025/05/BMW5Series-1.png,18999,https://www.prorido.com/product/bmw-5-series/
18,Audi A4,Sedan,Audi,4,3 medium + 2 small,19770,19000,26000,33000,52500,52500,1000,1000,1750,175,1750,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2025/05/AudiA4-1.png,18999,https://www.prorido.com/product/audi-a4/
19,Jaguar XF,Sedan,Jaguar,4,3 medium + 2 small,19770,19000,26000,33000,52500,52500,1000,1000,1750,175,1750,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2025/05/JaguarXF-1.png,18999,https://www.prorido.com/product/jaguar-xf/
20,Mercedes E Class,Sedan,Mercedes,4,3 medium + 2 small,19770,19000,26000,33000,52500,52500,1000,1000,1750,175,1750,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2025/05/MercedesEClass-1.png,18999,https://www.prorido.com/product/mercedes-e-class/
84,Lexus ES 300H,Sedan,Lexus,4,2 medium + 3 small,19770,19000,26000,33000,52500,52500,1000,1000,1750,175,1750,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/Lexus-ES-300H_F3QVView-1.png,18999,https://www.prorido.com/product/lexus-es-300h/
85,VOLVO S60,Sedan,Volvo,4,2 medium + 3 small,19770,19000,26000,28600,52500,52500,1000,1000,1750,175,1750,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/VOLVO-S60_F3QV-1.png,18999,https://www.prorido.com/product/volvo-s60/
88,BMW iX,SUV,BMW,4,4 medium + 4 small,19770,19000,26000,31000,52500,52500,1000,1000,1750,175,700,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/BMW_iX__electric.png,18999,https://www.prorido.com/product/bmw-ix-electric/
89,BMW i4 ,Sedan,BMW,4,2 medium + 3 small,19770,19000,26000,28800,52500,52500,1000,1000,1750,175,700,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/BMW_i4__electric.png,18999,https://www.prorido.com/product/bmw-i4-electric/
62,Volvo Bus 55 Seater,Bus,Volvo,54,20+ large total,18500,20000,25200,30400,39000,39000,2000,2000,1300,130,1300,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/Volvobus55Seater.webp,18499,https://www.prorido.com/product/volvo-bus-55-seater/
63,Volvo Bus 52 Seater,Bus,Volvo,51,20+ large total,18500,20000,25000,30000,37500,37500,2000,2000,1250,125,1250,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/Volvobus52Seater.webp,18499,https://www.prorido.com/product/volvo-bus-52-seater/
46,Toyota VIP Commuter,VAN,Toyota,9,5 medium + 6 small,17770,17000,22200,27400,39000,39000,1500,1500,1300,130,1300,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/ToyotaVipCommuter.webp,16999,https://www.prorido.com/product/toyota-vip-commuter/
65,Premium Bus 50 Seater,Bus,Bus,49,18+ large total,17500,19500,23900,28300,33000,33000,2000,2000,1100,110,1100,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/PremiumBus50Seater.webp,17499,https://www.prorido.com/product/premium-bus-50-seater/
72,Premium Bus 33 Sleeper,Bus,Bus,32,15+ large total,17500,19500,23500,27500,30000,30000,1500,1500,1000,100,1000,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/PremiumBus33sleeper.webp,17499,https://www.prorido.com/product/premium-bus-33-sleeper/
73,Sleeper Coach 33 Seater,Bus,Bus,32,15+ large total,17500,19500,23500,27500,30000,30000,1500,1500,1000,100,1000,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/SleeperCoach33seater.webp,17499,https://www.prorido.com/product/sleeper-coach-33-seater/
71,Sleeper Volvo Bus 33 Seater,Bus,Volvo,32,15+ large total,17000,18000,22000,26000,30000,30000,1500,1500,1000,100,1000,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/SleeperVolvoBus33Seater.webp,16999,https://www.prorido.com/product/volvo-bus-33-sleeper/
80,Audi RS 5,Sedan,Audi,4,2 medium + 3 small,17000,22000,28000,34000,45000,45000,1500,1500,1500,150,1500,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/AudiRS5.png,16999,https://www.prorido.com/product/audi-rs-5/
81,Mercedes C 300 Cabriolet,Sedan Convertible,Mercedes,3,2 medium + 3 small,17000,22000,28000,34000,45000,45000,1500,1500,1500,150,1500,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/Mercedes-C-300-Cabriolet_F3QV-1.png,16999,https://www.prorido.com/product/mercedes-c-300-cabriolet/
53,Toyota Hiace,VAN,Toyota,9,4 medium + 5 small,15770,15000,21000,27000,45000,45000,1500,1500,1500,150,1500,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/01/Toyota_Hiace.png,14999,https://www.prorido.com/product/toyota-hiace/
69,Premium Bus,Bus,Bus,,16+ large total,15000,17000,20600,24200,27000,27000,2000,2000,900,90,900,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/PremiumBus.webp,14999,https://www.prorido.com/product/premium-bus/
55,Force Urbania Maharaja,VAN,Force,15,5 medium + 6 small,14770,14000,18000,22000,30000,30000,1000,1000,1000,100,1000,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/ForceUrbania.png,13999,https://www.prorido.com/product/force-urbania-maharaja/
54,Force Urbania,VAN,Force,9,5 medium + 6 small,12770,12000,16000,20000,30000,30000,1000,1000,1000,100,1000,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/ForceUrbania.png,11999,https://www.prorido.com/product/force-urbania/
82,Mini Cooper S Countrymen Convertible,Sedan Convertible,Mini Cooper,4,2 medium + 3 small,12500,17500,22500,27500,45000,45000,1000,1000,1000,150,1000,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/Mini_Cooper_S_Countrymen_Convertible.png,12499,https://www.prorido.com/product/mini-cooper-s-countrymen-convertible/
51,FOTON,VAN,FOTON,9,3 medium + 4 small,11270,10500,14700,18900,31500,31500,1500,1500,1050,105,1050,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/Foton_91.png,10499,https://www.prorido.com/product/foton/
52,Toyota Granace,VAN,Toyota,5,3 medium + 4 small,11270,10500,14700,18900,31500,31500,1500,1500,1050,105,1050,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/TOYOTAgranace51VAN_F3VQ.webp,10499,https://www.prorido.com/product/toyota-granace/
74,Premium Coach 25 Seater,Bus,Bus,24,12+ large total,11000,12000,16000,20000,30000,30000,1500,1500,1000,100,1000,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2025/05/PremiumCoach25Seater.png,10999,https://www.prorido.com/product/premium-coach-25-seater/
83,Mini Cooper Countrymen,Sedan,Mini Cooper,4,2 medium + 3 small,10000,15500,19500,23500,36000,36000,1000,1000,800,120,800,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/Mini_Cooper_Countrymen.png,9999,https://www.prorido.com/product/mini-cooper-countrymen/
86,Toyota Hilux 4x4,SUV,Toyota,4,4 medium + 4 small,10000,13000,16800,20600,36000,36000,1000,1000,700,120,700,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/ToyotaHilux.png,9999,https://www.prorido.com/product/toyota-hilux-4x4/
10,Toyota Camry,Sedan,Toyota,4,4 medium + 2 small,9770,9700,13580,17460,29100,29100,1000,1000,970,97,970,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/ToyotaCamry_F3VQ.webp,9699,https://www.prorido.com/product/toyota-camry/
12,Toyota Fortuner,SUV,Toyota,6,4 medium + 4 small,9770,9700,13580,17460,29100,29100,1000,1000,970,97,970,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/ToyotaCorolla_F3VQ.webp,9699,https://www.prorido.com/product/toyota-fortuner/
50,Kia Carnival,VAN,Kia,6,4 medium + 4 small,9770,9700,13300,16900,27000,27000,1000,1000,900,90,900,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/KiaCarnival.png,9699,https://www.prorido.com/product/kia-carnival/
58,Traveller Maharaja Luxury,VAN,Traveller,"14,18",6 medium + 8 small,9770,9500,12900,16300,25500,25500,1000,1000,850,85,850,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/TravellerMaharajaLuxury.webp,9499,https://www.prorido.com/product/traveller-maharaja-luxury/
75,Coach 25 Seater,Bus,Bus,24,12+ large total,9000,14000,16800,19600,21000,21000,1500,1500,700,70,700,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/Coach25Seater.png,8999,https://www.prorido.com/product/coach-25-seater/
57,Traveller Maharaja Premium,VAN,Traveller,11,6 medium + 8 small,8770,8500,11500,14500,22500,22500,1000,1000,750,75,750,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/TravellerMaharajaPremium.webp,8499,https://www.prorido.com/product/traveller-maharaja-premium/
61,Tempo Traveller Luxury,VAN,Tempo,"14,18",6 medium + 8 small,8770,8500,11500,14500,22500,22500,1000,1000,750,75,750,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/TempoTravellerLuxury.webp,8499,https://www.prorido.com/product/tempo-traveller-luxury/
76,Premium Bus 21 Seater,Bus,Bus,20,10+ large total,8500,15000,18000,21000,22500,22500,1500,1500,750,75,750,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/PremiumBus21seaterwithotilets.webp,8499,https://www.prorido.com/product/premium-bus-21-seater/
11,Toyota Corolla,Sedan,Toyota,4,3 medium + 2 small,7770,7700,10780,13860,23100,23100,1000,1000,770,77,770,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2025/05/ToyotaCorolla.png,7699,https://www.prorido.com/product/toyota-corolla/
56,Traveller Maharaja,VAN,Traveller,11,6 medium + 8 small,7770,7500,10100,12700,19500,19500,1000,1000,650,65,650,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/TravellerMaharaja.webp,7499,https://www.prorido.com/product/traveller-maharaja/
77,Coach 21 Seater,Bus,Coach,20,10+ large total,7500,12000,14800,17600,21000,21000,1500,1500,700,70,700,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/Coach21Seater.png,7499,https://www.prorido.com/product/coach-21-seater/
91,BYD SEAL,Sedan,BYD,4,2 medium + 3 small,7500,10000,12800,15600,24000,24000,750,750,600,80,600,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/BYD-SEAL.png,7499,https://www.prorido.com/product/byd-seal/
60,Tempo Traveller Premium,VAN,Tempo,11,6 medium + 8 small,7270,7000,9400,11800,18000,18000,1000,1000,600,60,600,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/TempoTravellerPremium.webp,6999,https://www.prorido.com/product/tempo-traveller-premium/
59,Tempo Traveller,VAN,Tempo,11,6 medium + 8 small,6770,6500,8700,10900,16500,16500,1000,1000,550,55,550,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/TempoTraveller.webp,6499,https://www.prorido.com/product/tempo-traveller/
13,Toyota Hycross,SUV,Toyota,"6,7",3 medium + 4 small,5770,5700,7580,9460,14100,14100,750,750,470,47,470,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2025/05/ToyotaHycross.png,5699,https://www.prorido.com/product/toyota-hycross/
14,Maruti Suzuki Invicto,SUV,Maruti,"6,7",3 medium + 4 small,5770,5700,7580,9460,14100,14100,750,750,470,47,470,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/MarutiSuzukiInvicto.webp,5699,https://www.prorido.com/product/maruti-suzuki-invicto/
43,BYD EV SUV,SUV,BYD,4,4 medium + 3 small,5570,5500,7380,9260,14100,14100,750,750,470,47,470,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/BYD_EV_SUV.png,5499,https://www.prorido.com/product/byd-ev-suv/
92,MG ZS,SUV,MG,4,4 medium + 4 small,5000,5000,6240,7480,9600,9600,750,750,300,32,300,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/MG_ZS.png,4999,https://www.prorido.com/product/mg-zs/
93,Hyundai Kona,SUV,Hyundai,4,4 medium + 4 small,5000,5000,6240,7480,9600,9600,750,750,300,32,300,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/HyundaiKona_F3QV-1.png,4999,https://www.prorido.com/product/hyundai-kona/
1,Toyota Innova Crysta,SUV,Toyota,"6,7",4 medium + 4 small,4870,4800,6400,8000,12000,12000,750,750,400,40,400,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/ToyotaInnovaCrysta.webp,4799,https://www.prorido.com/product/toyota-innova-crysta/
15,Honda City,Sedan,Honda,4,3 medium + 2 small,4870,4800,6280,7760,11100,11100,600,600,370,37,370,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/HondaCity.png,4799,https://www.prorido.com/product/honda-city/
16,Maruti Ciaz,Sedan,Maruti,4,3 medium + 2 small,4870,4800,6280,7760,11100,11100,600,600,370,37,370,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/MarutiCiaz.webp,4799,https://www.prorido.com/product/maruti-ciaz/
2,Toyota Innova,SUV,Toyota,"6,7",4 medium + 4 small,4570,4500,6020,7540,11400,11400,750,750,380,38,380,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/ToyotaInnova.webp,4499,https://www.prorido.com/product/toyota-innova/
3,Maruti Suzuki Ertiga,SUV,Maruti,6,3 medium + 4 small,4270,4200,5640,7080,10800,10800,600,600,360,36,360,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/MarutiSuzukiErtiga.webp,4199,https://www.prorido.com/product/maruti-suzuki-ertiga/
4,Kia Carens,SUV,Kia,"5,6",3 medium + 3 small,4270,4200,5640,7080,10800,10800,600,600,360,36,360,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/KiaCarens.png,4199,https://www.prorido.com/product/kia-carens/
94,Toyota Urban Crusader,SUV,Toyota,4,4 medium + 4 small,4270,4200,5640,7080,10800,10800,600,600,360,36,360,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/Toyota-Urban-Crusader_F3QV-1.png,4199,https://www.prorido.com/product/toyota-urban-crusader/
5,Hyundai Aura,Sedan,Hyundai,4,3 medium + 2 small,3870,3800,4720,5640,6900,6900,600,600,230,23,230,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/HyundaiAura.png,3799,https://www.prorido.com/product/hyundai-aura/
6,Hyundai Amaze,Sedan,Hyundai,4,3 medium + 2 small,3870,3800,4720,5640,6900,6900,600,600,230,23,230,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/HyundaiAmaze.png,3799,https://www.prorido.com/product/honda-amaze/
7,Toyota Etios,Sedan,Toyota,4,4 medium + 2 small,3870,3800,4720,5640,6900,6900,600,600,230,23,230,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/ToyotaEtios_F3VQ.webp,3799,https://www.prorido.com/product/toyota-etios/
8,Swift Dzire,Sedan,Swift,4,3 medium + 2 small,3870,3800,4720,5640,6900,6900,600,600,230,23,230,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/SwiftDzire.webp,3799,https://www.prorido.com/product/swift-dzire/
9,Hyundai Accent,Sedan,Hyundai,4,3 medium + 2 small,3870,3800,4720,5640,6900,6900,600,600,230,23,230,50,2,80,8,100,10,120,12,300,300,24,"Driver Charges, Fuel","Toll, Parking Charges, State Permit, Taxes",https://www.prorido.com/wp-content/uploads/2026/02/HyundaiAccent.png,3799,https://www.prorido.com/product/hyundai-accent/`;

// Parse CSV lines carefully handling quotes
const parseCsv = (csv) => {
    const lines = csv.trim().split("\n");
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
    // Determine Brand & Model cleanly
    let brand = item.brand ? item.brand.trim() : "GoRido";
    let fullName = item.name ? item.name.trim() : "";
    let model = fullName;

    if (brand && fullName.toLowerCase().startsWith(brand.toLowerCase())) {
        model = fullName.slice(brand.length).trim();
    }
    if (!model) model = fullName || brand;

    // Keep category clean & descriptive
    let category = item.category ? item.category.trim() : "Sedan";

    // Seating capacity
    let seatingCapacity = 4;
    let seatingStr = item.seating ? String(item.seating).trim() : "4";
    if (seatingStr) {
        const seatMatches = seatingStr.match(/\d+/g);
        if (seatMatches && seatMatches.length > 0) {
            seatingCapacity = parseInt(seatMatches[seatMatches.length - 1], 10);
        }
    }

    // Baggage capacity & luggage text
    let luggageStr = item.luggage ? String(item.luggage).trim() : "3 medium + 2 small";
    let baggageCapacity = 2;
    const luggageMatch = luggageStr.match(/\d+/);
    if (luggageMatch) {
        baggageCapacity = parseInt(luggageMatch[0], 10);
    }

    // Fuel Type & Transmission inferring
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

    // Number parser helper
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

    // Includes & Excludes
    const includes = item.includes ? item.includes.split(",").map(f => f.replace(/"/g, '').trim()).filter(Boolean) : ["Driver Charges", "Fuel"];
    const excludes = item.excludes ? item.excludes.split(",").map(f => f.replace(/"/g, '').trim()).filter(Boolean) : ["Toll", "Parking Charges", "State Permit", "Taxes"];

    const features = Array.from(new Set([
        ...includes,
        "Air Conditioning",
        "Verified Professional Driver",
        "24/7 Roadside Assistance",
        "Clean & Sanitized Interiors"
    ])).filter(Boolean);

    const locations = ["Delhi", "Mumbai", "Bengaluru", "Hyderabad", "Chennai", "Kolkata", "Ahmedabad", "Pune"];
    const location = locations[parseInt(item.id || "0", 10) % locations.length];

    return {
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

        includes: includes,
        excludes: excludes,
        location: location,
        description: `Choose a chauffeur driven ${fullName} (Seating: ${seatingStr}) in India for airport transfers, corporate travel, and city rides. Enjoy spacious seating, smooth performance, and professional chauffeur service across major locations.`,
        features: features,
        isAvaliable: true
    };
};

export const seedAllFleet = async () => {
    try {
        await connectDB();
        console.log("Connected to MongoDB for fleet seeding...");

        // 1. Delete all previous cars
        const deleted = await Car.deleteMany({});
        console.log(`Deleted ${deleted.deletedCount} previous car documents from database.`);

        // 2. Parse CSV
        const parsedRows = parseCsv(csvData);
        console.log(`Parsed ${parsedRows.length} vehicles from CSV.`);

        // 3. Format into Car documents
        const carDocuments = parsedRows.map(formatCarDocument);

        // 4. Insert new fleet
        const inserted = await Car.insertMany(carDocuments);
        console.log(`Successfully inserted ${inserted.length} vehicles into GoRido fleet!`);

        process.exit(0);
    } catch (error) {
        console.error("Seeding error:", error);
        process.exit(1);
    }
};

seedAllFleet();

