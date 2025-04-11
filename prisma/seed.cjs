"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_1 = require("../app/generated/prisma");
var bcrypt_1 = require("bcrypt");
var prisma = new prisma_1.PrismaClient();
function hashPassword(password) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, bcrypt_1.default.hash(password, 10)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function ensureUser(userData) {
    return __awaiter(this, void 0, void 0, function () {
        var user, _a, _b, _c;
        var _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, prisma.user.findUnique({ where: { email: userData.email } })];
                case 1:
                    user = _f.sent();
                    if (!!user) return [3 /*break*/, 4];
                    _b = (_a = prisma.user).create;
                    _d = {};
                    _c = [__assign({}, userData)];
                    _e = {};
                    return [4 /*yield*/, hashPassword(userData.password)];
                case 2: return [4 /*yield*/, _b.apply(_a, [(_d.data = __assign.apply(void 0, _c.concat([(_e.password = _f.sent(), _e.admin = userData.user_type === 'ADMIN' ? { create: { permissions: 'FULL_ACCESS' } } : undefined, _e.customer = userData.user_type === 'CUSTOMER' ? { create: {} } : undefined, _e.business_owner = userData.user_type === 'BUSINESSOWNER' ? { create: {} } : undefined, _e)])),
                            _d)])];
                case 3:
                    user = _f.sent();
                    _f.label = 4;
                case 4: return [2 /*return*/, user];
            }
        });
    });
}
function ensureCategory(name) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma.category.upsert({
                        where: { category_name: name },
                        update: {},
                        create: { category_name: name },
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function ensureLocation(locationData) {
    return __awaiter(this, void 0, void 0, function () {
        var existing;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma.location.findFirst({
                        where: {
                            city: locationData.city,
                            province: locationData.province,
                            postal_code: locationData.postal_code,
                        },
                    })];
                case 1:
                    existing = _a.sent();
                    if (existing)
                        return [2 /*return*/, existing];
                    return [4 /*yield*/, prisma.location.create({ data: locationData })];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function addBusinessWithOwner(user, businessData, locationData, sellablesData) {
    return __awaiter(this, void 0, void 0, function () {
        var location, business;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ensureLocation(locationData)];
                case 1:
                    location = _a.sent();
                    return [4 /*yield*/, prisma.business.create({
                            data: __assign(__assign({}, businessData), { owner: { connect: { user_id: user.user_id } }, is_verified: true, location: { connect: { location_id: location.location_id } }, sellables: {
                                    create: sellablesData.map(function (s) { return ({
                                        name: s.name,
                                        sellable_type: s.type,
                                        price: s.price,
                                        description: s.description,
                                        media: s.media,
                                    }); }),
                                } }),
                        })];
                case 2:
                    business = _a.sent();
                    return [2 /*return*/, business];
            }
        });
    });
}
function seed() {
    return __awaiter(this, void 0, void 0, function () {
        var categories, _i, categories_1, name_1, users, createdUsers, _a, users_1, userData, user, customer, businesses, i, transaction;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    categories = ['Technology', 'Food & Beverages', 'Utilities & Services', 'Agricultural Supplies'];
                    _i = 0, categories_1 = categories;
                    _b.label = 1;
                case 1:
                    if (!(_i < categories_1.length)) return [3 /*break*/, 4];
                    name_1 = categories_1[_i];
                    return [4 /*yield*/, ensureCategory(name_1)];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    users = [
                        // ADMIN
                        { first_name: 'Marieta Liezl', last_name: 'Lumanlan', email: 'admin@trompo.com', password: 'admin123', phone_number: '09123456789', user_type: 'ADMIN', user_auth: 'EMAIL', is_verified: true, profile_picture: "https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLAgkD7aSNrZOeMAY7Vj650y1dqBwIc38aShWXT" },
                        // 2 CUSTOMERS
                        { first_name: 'Ceanne', last_name: 'Arenas', email: 'ceannekolinnearenas@gmail.com', password: 'customer123', phone_number: '09604527480', user_type: 'CUSTOMER', user_auth: 'EMAIL', is_verified: true, profile_picture: "https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLA3jYFlRmqjGFhUrp4xC6SQlYnby9HzvXZ2dKM" },
                        { first_name: 'Eric Bernard', last_name: 'Aquino', email: 'aquino.ericbernard17@gmail.com', password: 'customer456', phone_number: '09224455667', user_type: 'CUSTOMER', user_auth: 'EMAIL', is_verified: true, profile_picture: "https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLAi3RPg10NFJTV9Z75vEzGoY2qf4hXMd1xDPC6" },
                        // 3 BUSINESS OWNERS W/ VERIFIED BUSINESSES
                        { first_name: 'May', last_name: 'Galvan', email: 'ck_mgalvan@yahoo.com.ph', password: 'galvan123', phone_number: '09694345652', user_type: 'BUSINESSOWNER', user_auth: 'PHONE', is_verified: true, profile_picture: "https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLAfspIcqF0eMvj5gRmE29ZPNirsIkWwKn3lJ46" },
                        { first_name: 'Bernadette', last_name: 'Aquino', email: 'beamfreshwaters@gmail.com', password: 'aquino123', phone_number: '09958552475', user_type: 'BUSINESSOWNER', user_auth: 'PHONE', is_verified: true, profile_picture: "https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLAMVngkFKgsHLAuiXYfo8bF34BJQkwl9DCNGmn" },
                        { first_name: 'Arvin', last_name: 'Mejia', email: 'joeric672@gmail.com', password: 'mejia123', phone_number: '09100627191', user_type: 'BUSINESSOWNER', user_auth: 'PHONE', is_verified: true, profile_picture: "https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLACthuFrYKdyxZbR5I3Vjs4mo7lYPXcWkGO26p" },
                        // 3 UNVERIFIED USERS
                        { first_name: 'Unverified', last_name: 'User1', email: 'user1@trompo.com', password: 'user123', phone_number: '09111222333', user_type: 'CUSTOMER', user_auth: 'EMAIL', is_verified: false, profile_picture: "https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLAEmsHcJCqhsE4HRgSQvMLNDBmTfkJbtWe70ou" },
                        { first_name: 'Unverified', last_name: 'User2', email: 'user2@trompo.com', password: 'user123', phone_number: '09111222333', user_type: 'CUSTOMER', user_auth: 'EMAIL', is_verified: false, profile_picture: "https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLAEmsHcJCqhsE4HRgSQvMLNDBmTfkJbtWe70ou" },
                        { first_name: 'Unverified', last_name: 'User3', email: 'user3@trompo.com', password: 'user123', phone_number: '09111222333', user_type: 'CUSTOMER', user_auth: 'EMAIL', is_verified: false, profile_picture: "https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLAEmsHcJCqhsE4HRgSQvMLNDBmTfkJbtWe70ou" },
                        // 3 USERS WITH UNVERIFIED BUSINESSES
                        { first_name: 'Verified', last_name: 'User1', email: 'user4@trompo.com', password: 'user123', phone_number: '09111222333', user_type: 'CUSTOMER', user_auth: 'EMAIL', is_verified: true, profile_picture: "https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLAEmsHcJCqhsE4HRgSQvMLNDBmTfkJbtWe70ou" },
                        { first_name: 'Verified', last_name: 'User2', email: 'user5@trompo.com', password: 'user123', phone_number: '09111222333', user_type: 'CUSTOMER', user_auth: 'EMAIL', is_verified: true, profile_picture: "https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLAEmsHcJCqhsE4HRgSQvMLNDBmTfkJbtWe70ou" },
                        { first_name: 'Verified', last_name: 'User3', email: 'user6@trompo.com', password: 'user123', phone_number: '09111222333', user_type: 'CUSTOMER', user_auth: 'EMAIL', is_verified: true, profile_picture: "https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLAEmsHcJCqhsE4HRgSQvMLNDBmTfkJbtWe70ou" },
                    ];
                    createdUsers = {};
                    _a = 0, users_1 = users;
                    _b.label = 5;
                case 5:
                    if (!(_a < users_1.length)) return [3 /*break*/, 8];
                    userData = users_1[_a];
                    return [4 /*yield*/, ensureUser(userData)];
                case 6:
                    user = _b.sent();
                    createdUsers[userData.user_type + '_' + user.user_id] = user;
                    _b.label = 7;
                case 7:
                    _a++;
                    return [3 /*break*/, 5];
                case 8: return [4 /*yield*/, addBusinessWithOwner(createdUsers['BUSINESSOWNER_4'], {
                        business_name: 'GalVloyo Smoked and Dried Fish Store',
                        description: 'Authorized distributor of Skye Smoked and Dried Fish Products in Makati City.',
                        category: 'Food & Beverages',
                        banner: 'https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLAS1akgYZgnkwToRlBxMq3uOmGt96fKcZCsrWi',
                        logo: 'https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLAx7h2Cy8rOKNzis24n6wCm8ghdLaUJtoPFQ15',
                        address: 'Tower C Jazz Residences, N. Garcia St., Brgy. Bel-Air',
                        contact_number: '09694345652',
                    }, { city: 'Makati', province: 'NCR', postal_code: '1209' }, [
                        { name: 'Tinapang Tunsoy', type: 'PRODUCT', price: 240, description: 'Smoked fish', media: ['https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLAwHhDzy0XpksdUhT9jLR2AgKZ4YatzCylHeXS'] },
                        { name: 'Tinapang Babae', type: 'PRODUCT', price: 260, description: 'Smoked fish', media: ['https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLAy8fPrrhd4C3ZmIL8eWhoF9V0zgnkuPlcbBMH'] },
                        { name: 'Tinapang Lalaki', type: 'PRODUCT', price: 280, description: 'Smoked fish', media: ['https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLA1kltKnzJ1LV5SDYv4XcBHMpbeiAdFnjG09my'] },
                        { name: 'Tinapang Bangus', type: 'PRODUCT', price: 310, description: 'Smoked fish', media: ['https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLAQFgw0jr4Hpwf0JT7zqod1e2YI5Pc6MViyvtU'] }
                    ])];
                case 9:
                    _b.sent();
                    return [4 /*yield*/, addBusinessWithOwner(createdUsers['BUSINESSOWNER_5'], {
                            business_name: 'Beamfresh Water Refilling Station',
                            description: 'Water refilling station.',
                            category: 'Utilities & Services',
                            banner: 'https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLAYndSKqxKELc0TedjOU9BsxZlqRwMof3D1Nkp',
                            logo: 'https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLAkPMYpgarngDG5HOehxEbSC0P7Kt49L8TXlIF',
                            address: '194 Camastilisan',
                            contact_number: '09958552475',
                        }, { city: 'Calaca', province: 'Batangas', postal_code: '4212' }, [
                            { name: 'Purified Water', type: 'SERVICE', price: 25, description: 'Clean water gallon', media: ['https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLAmz6Rq9I1TaSOFsHz2qKePjd6R17CuV3kL8xU'] },
                        ])];
                case 10:
                    _b.sent();
                    return [4 /*yield*/, addBusinessWithOwner(createdUsers['BUSINESSOWNER_6'], {
                            business_name: 'Hamellek Hog & Poultry Supply',
                            description: 'Selling feeds, vitamins, and other needs for happy and healthy farm animals.',
                            category: 'Agricultural Supplies',
                            banner: 'https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLABa85Vvwb0AyuM7lYtT1mW6LOwngRo5XerHvp',
                            logo: 'https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLAJy22o8zOAokWjfU57YwxlI3CrETdLayDRbpm',
                            address: 'Quezon',
                            contact_number: '09100627191',
                        }, { city: 'Naguilian', province: 'Isabela', postal_code: '3302' }, [
                            { name: 'Enertone', type: 'PRODUCT', price: 40, description: 'Feed supplement', media: ['https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLAld5IQY63nLez6WEBfONixA5dTaCgS98JIlUX'] },
                            { name: 'Baby Stag Booster', type: 'PRODUCT', price: 52, description: 'Feed supplement', media: ['https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLA1SsQ5sJ1LV5SDYv4XcBHMpbeiAdFnjG09myq'] },
                            { name: 'Stag Developer', type: 'PRODUCT', price: 40, description: 'Feed supplement', media: ['https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLA1ymmnSJ1LV5SDYv4XcBHMpbeiAdFnjG09myq'] },
                            { name: 'Belamyl (10mL)', type: 'PRODUCT', price: 290, description: 'Belamyl 10mL variant', media: ['https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLAWLQzRh7Hnby4ZijPIMhQ8Lz9rwgK3H5VTpt1'] },
                            { name: 'Hog Gestating (BMEG)', type: 'PRODUCT', price: 45, description: 'Price per kilo', media: ['https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLAWeDQHnby4ZijPIMhQ8Lz9rwgK3H5VTpt1OoY'] }
                        ])];
                case 11:
                    _b.sent();
                    // 3 UNVERIFIED BUSINESSES
                    return [4 /*yield*/, addBusinessWithOwner(createdUsers['BUSINESSOWNER_10'], {
                            business_name: 'Unverified Business #1',
                            description: 'Unverified placeholder biz.',
                            category: 'Utilities & Services',
                            banner: 'https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLAxgJ4uE8rOKNzis24n6wCm8ghdLaUJtoPFQ15',
                            logo: 'https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLAmzuajMe1TaSOFsHz2qKePjd6R17CuV3kL8xU',
                            address: '194 Camastilisan',
                            contact_number: '09111222333',
                        }, { city: 'Calaca', province: 'Batangas', postal_code: '4212' }, [
                            { name: 'Placeholder Product', type: 'PRODUCT', price: 25, description: 'Placeholder product', media: ['https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLAKhGyOOUIQlsiA6u9gbrXkBLpe5z1Ca3UcEDY'] },
                        ])];
                case 12:
                    // 3 UNVERIFIED BUSINESSES
                    _b.sent();
                    return [4 /*yield*/, addBusinessWithOwner(createdUsers['BUSINESSOWNER_11'], {
                            business_name: 'Unverified Business #2',
                            description: 'Unverified placeholder biz.',
                            category: 'Technology',
                            banner: 'https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLAxgJ4uE8rOKNzis24n6wCm8ghdLaUJtoPFQ15',
                            logo: 'https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLAmzuajMe1TaSOFsHz2qKePjd6R17CuV3kL8xU',
                            address: '194 Camastilisan',
                            contact_number: '09111222333',
                        }, { city: 'Calaca', province: 'Batangas', postal_code: '4212' }, [
                            { name: 'Placeholder Product', type: 'PRODUCT', price: 25, description: 'Placeholder product', media: ['https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLAKhGyOOUIQlsiA6u9gbrXkBLpe5z1Ca3UcEDY'] },
                        ])];
                case 13:
                    _b.sent();
                    return [4 /*yield*/, addBusinessWithOwner(createdUsers['BUSINESSOWNER_12'], {
                            business_name: 'Unverified Business #3',
                            description: 'Unverified placeholder biz.',
                            category: 'Technology',
                            banner: 'https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLAxgJ4uE8rOKNzis24n6wCm8ghdLaUJtoPFQ15',
                            logo: 'https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLAmzuajMe1TaSOFsHz2qKePjd6R17CuV3kL8xU',
                            address: '194 Camastilisan',
                            contact_number: '09111222333',
                        }, { city: 'Calaca', province: 'Batangas', postal_code: '4212' }, [
                            { name: 'Placeholder Product', type: 'PRODUCT', price: 25, description: 'Placeholder product', media: ['https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLAKhGyOOUIQlsiA6u9gbrXkBLpe5z1Ca3UcEDY'] },
                        ])];
                case 14:
                    _b.sent();
                    customer = createdUsers['CUSTOMER_' + Object.keys(createdUsers).find(function (key) { return key.includes('CUSTOMER'); })];
                    return [4 /*yield*/, prisma.business.findMany({ include: { sellables: true } })];
                case 15:
                    businesses = _b.sent();
                    i = 0;
                    _b.label = 16;
                case 16:
                    if (!(i < 3)) return [3 /*break*/, 21];
                    return [4 /*yield*/, prisma.transaction.create({
                            data: {
                                customer: { connect: { user_id: customer.user_id } },
                                business: { connect: { business_id: businesses[i].business_id } },
                                status: 'PENDING',
                                date_initiated: new Date(),
                                items: {
                                    create: [{
                                            sellable: { connect: { sellable_id: businesses[i].sellables[0].sellable_id } },
                                            quantity: 1,
                                            price: businesses[i].sellables[0].price
                                        }]
                                }
                            }
                        })];
                case 17:
                    transaction = _b.sent();
                    return [4 /*yield*/, prisma.dispute.create({
                            data: {
                                transaction: { connect: { transaction_id: transaction.transaction_id } },
                                complainant: { connect: { user_id: customer.user_id } },
                                reason: "Dispute reason for transaction ".concat(i + 1),
                                status: 'PENDING'
                            }
                        })];
                case 18:
                    _b.sent();
                    return [4 /*yield*/, prisma.review.create({
                            data: {
                                customer: { connect: { user_id: customer.user_id } },
                                business: { connect: { business_id: businesses[i].business_id } },
                                rating: 5,
                                review_text: "This is a review for business ".concat(i + 1),
                                media: ["https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLAC8huOaYKdyxZbR5I3Vjs4mo7lYPXcWkGO26p"],
                                is_verified: true
                            }
                        })];
                case 19:
                    _b.sent();
                    _b.label = 20;
                case 20:
                    i++;
                    return [3 /*break*/, 16];
                case 21:
                    console.log('🎉 Seed completed');
                    return [2 /*return*/];
            }
        });
    });
}
seed()
    .then(function () { return prisma.$disconnect(); })
    .catch(function (e) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.error(e);
                return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                process.exit(1);
                return [2 /*return*/];
        }
    });
}); });
