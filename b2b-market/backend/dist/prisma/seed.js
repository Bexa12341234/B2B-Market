"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const prisma = new client_1.PrismaClient();
async function main() {
    const hashedPassword = await bcrypt.hash('password123', 10);
    console.log('Clearing old data...');
    const pharmacy = await prisma.segment.upsert({
        where: { name: 'Pharmacies' },
        update: {},
        create: { name: 'Pharmacies' },
    });
    const shop = await prisma.segment.upsert({
        where: { name: 'General Shops' },
        update: {},
        create: { name: 'General Shops' },
    });
    await prisma.user.upsert({
        where: { phone: '+998901234567' },
        update: {},
        create: {
            phone: '+998901234567',
            name: 'System Admin',
            password: hashedPassword,
            role: 'ADMIN',
        },
    });
    const supplier = await prisma.user.upsert({
        where: { phone: '+998907654321' },
        update: {},
        create: {
            phone: '+998907654321',
            name: 'PharmaCorp Inc.',
            password: hashedPassword,
            role: 'SUPPLIER',
        },
    });
    const retail = await prisma.user.upsert({
        where: { phone: '+998901112233' },
        update: {},
        create: {
            phone: '+998901112233',
            name: 'City Pharmacy #1',
            password: hashedPassword,
            role: 'RETAIL',
            segmentId: pharmacy.id,
        },
    });
    const meds = await prisma.category.upsert({
        where: { name: 'Medications' },
        update: {},
        create: { name: 'Medications' },
    });
    await prisma.product.create({
        data: {
            name: 'Paracetamol 500mg',
            brand: 'HealthFirst',
            basePrice: 5.0,
            categoryId: meds.id,
            supplierId: supplier.id,
            segments: {
                connect: [{ id: pharmacy.id }]
            }
        },
    });
    await prisma.product.create({
        data: {
            name: 'Vitamin C 1000mg',
            brand: 'VitaLife',
            basePrice: 12.0,
            categoryId: meds.id,
            supplierId: supplier.id,
            segments: {
                connect: [{ id: pharmacy.id }, { id: shop.id }]
            }
        },
    });
    console.log('Seed data created successfully!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map