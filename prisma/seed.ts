import { PrismaClient } from '../app/generated/prisma';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

async function ensureUser(userData: any) {
  let user = await prisma.user.findUnique({ where: { email: userData.email } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        ...userData,
        password: await hashPassword(userData.password),
        admin: userData.user_type === 'ADMIN' ? { create: { permissions: 'FULL_ACCESS' } } : undefined,
        customer: userData.user_type === 'CUSTOMER' ? { create: {} } : undefined,
        business_owner: userData.user_type === 'BUSINESSOWNER' ? { create: {} } : undefined,
      },
    });
  }
  return user;
}

async function ensureCategory(name: string) {
  await prisma.category.upsert({
    where: { category_name: name },
    update: {},
    create: { category_name: name },
  });
}

async function ensureLocation(locationData: any) {
  // Find location by city, province, and postal_code combination
  const existingLocation = await prisma.location.findFirst({
    where: {
      city: locationData.city,
      province: locationData.province,
      postal_code: locationData.postal_code,
    }
  });

  if (existingLocation) {
    return existingLocation;
  }

  // Create new location if it doesn't exist
  return await prisma.location.create({
    data: locationData
  });
}

// async function addBusinessWithOwner(user: any, businessData: any, locationData: any, sellablesData: any[]) {
//   const location = await ensureLocation(locationData);
  
//   // Get the BusinessOwner entry for this user
//   const businessOwner = await prisma.businessOwner.findUnique({
//     where: { user_id: user.user_id }
//   });

//   if (!businessOwner) {
//     throw new Error(`No BusinessOwner found for user_id: ${user.user_id}`);
//   }

//   const business = await prisma.business.create({
//     data: {
//       ...businessData,
//       owner: { connect: { user_id: businessOwner.user_id } },
//       is_verified: true,
//       location: { connect: { location_id: location.location_id } },
//       sellables: {
//         create: sellablesData.map(s => ({
//           name: s.name,
//           sellable_type: s.type,
//           price: s.price,
//           description: s.description,
//           media: s.media,
//         })),
//       },
//     },
//   });
//   return business;
// }

async function addBusinessWithOwner(user: any, businessData: any, locationData: any, sellablesData: any[]) {
  // Debug the user object
  console.log("User object received:", user);
  
  if (!user || !user.user_id) {
    throw new Error(`Invalid user object: ${JSON.stringify(user)}`);
  }

  const location = await ensureLocation(locationData);
  
  // Get the BusinessOwner entry for this user
  const businessOwner = await prisma.businessOwner.findUnique({
    where: { user_id: user.user_id }
  });

  if (!businessOwner) {
    throw new Error(`No BusinessOwner found for user_id: ${user.user_id}`);
  }

  // Debug the businessOwner object
  console.log("Business owner found:", businessOwner);

  const business = await prisma.business.create({
    data: {
      ...businessData,
      owner: { connect: { user_id: businessOwner.user_id } },
      is_verified: true,
      location: { connect: { location_id: location.location_id } },
      sellables: {
        create: sellablesData.map(s => ({
          name: s.name,
          sellable_type: s.type,
          price: s.price,
          description: s.description,
          media: s.media,
        })),
      },
    },
  });
  return business;
}

async function seed() {
  const categories = ['Technology', 'Food & Beverages', 'Utilities & Services', 'Agricultural Supplies'];
  for (const name of categories) await ensureCategory(name);

  const users = [
    // ADMIN
    { first_name: 'Marieta Liezl', last_name: 'Lumanlan', email: 'admin@trompo.com', password: 'admin123', phone_number: '09123456789', user_type: 'ADMIN', user_auth: 'EMAIL', is_verified: true, profile_picture: "https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLAgkD7aSNrZOeMAY7Vj650y1dqBwIc38aShWXT" },
    // 2 CUSTOMERS
    { first_name: 'Ceanne', last_name: 'Arenas', email: 'ceannekolinnearenas@gmail.com', password: 'customer123', phone_number: '09604527480', user_type: 'CUSTOMER', user_auth: 'EMAIL', is_verified: true, profile_picture: "https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLA3jYFlRmqjGFhUrp4xC6SQlYnby9HzvXZ2dKM" },
    { first_name: 'Eric Bernard', last_name: 'Aquino', email: 'aquino.ericbernard17@gmail.com', password: 'customer456', phone_number: '09224455667', user_type: 'CUSTOMER', user_auth: 'EMAIL', is_verified: true, profile_picture: "https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLAi3RPg10NFJTV9Z75vEzGoY2qf4hXMd1xDPC6" },
    // 3 BUSINESS OWNERS W/ VERIFIED BUSINESSES
    { first_name: 'May', last_name: 'Galvan', email: 'ck_mgalvan@yahoo.com.ph', password: 'galvan123', phone_number: '09694345652', user_type: 'BUSINESSOWNER', user_auth: 'EMAIL', is_verified: true, profile_picture: "https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLAfspIcqF0eMvj5gRmE29ZPNirsIkWwKn3lJ46" },
    { first_name: 'Bernadette', last_name: 'Aquino', email: 'beamfreshwaters@gmail.com', password: 'aquino123', phone_number: '09958552475', user_type: 'BUSINESSOWNER', user_auth: 'EMAIL', is_verified: true, profile_picture: "https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLAMVngkFKgsHLAuiXYfo8bF34BJQkwl9DCNGmn" },
    { first_name: 'Arvin', last_name: 'Mejia', email: 'joeric672@gmail.com', password: 'mejia123', phone_number: '09100627191', user_type: 'BUSINESSOWNER', user_auth: 'EMAIL', is_verified: true, profile_picture: "https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLACthuFrYKdyxZbR5I3Vjs4mo7lYPXcWkGO26p" },
    // 3 UNVERIFIED USERS
    { first_name: 'Unverified', last_name: 'User1', email: 'user1@trompo.com', password: 'user123', phone_number: '09111222333', user_type: 'CUSTOMER', user_auth: 'EMAIL', is_verified: false, profile_picture: "https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLAEmsHcJCqhsE4HRgSQvMLNDBmTfkJbtWe70ou" },
    { first_name: 'Unverified', last_name: 'User2', email: 'user2@trompo.com', password: 'user123', phone_number: '09111222333', user_type: 'CUSTOMER', user_auth: 'EMAIL', is_verified: false, profile_picture: "https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLAEmsHcJCqhsE4HRgSQvMLNDBmTfkJbtWe70ou" },
    { first_name: 'Unverified', last_name: 'User3', email: 'user3@trompo.com', password: 'user123', phone_number: '09111222333', user_type: 'CUSTOMER', user_auth: 'EMAIL', is_verified: false, profile_picture: "https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLAEmsHcJCqhsE4HRgSQvMLNDBmTfkJbtWe70ou" },
    // 3 USERS WITH UNVERIFIED BUSINESSES
    { first_name: 'Verified', last_name: 'User1', email: 'user4@trompo.com', password: 'user123', phone_number: '09111222333', user_type: 'BUSINESSOWNER', user_auth: 'EMAIL', is_verified: true, profile_picture: "https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLAEmsHcJCqhsE4HRgSQvMLNDBmTfkJbtWe70ou" },
    { first_name: 'Verified', last_name: 'User2', email: 'user5@trompo.com', password: 'user123', phone_number: '09111222333', user_type: 'BUSINESSOWNER', user_auth: 'EMAIL', is_verified: true, profile_picture: "https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLAEmsHcJCqhsE4HRgSQvMLNDBmTfkJbtWe70ou" },
    { first_name: 'Verified', last_name: 'User3', email: 'user6@trompo.com', password: 'user123', phone_number: '09111222333', user_type: 'BUSINESSOWNER', user_auth: 'EMAIL', is_verified: true, profile_picture: "https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLAEmsHcJCqhsE4HRgSQvMLNDBmTfkJbtWe70ou" },
  ];

  const createdUsers: Record<string, any> = {};
  for (const userData of users) {
    const user = await ensureUser(userData);
    createdUsers[userData.user_type + '_' + user.user_id] = user;
      // Add this before calling addBusinessWithOwner
    console.log("Available user keys:", Object.keys(createdUsers));
  }

  await addBusinessWithOwner(createdUsers['BUSINESSOWNER_67f94c3082299e43bbdd02bb'], {
    business_name: 'GalVloyo Smoked and Dried Fish Store',
    description: 'Authorized distributor of Skye Smoked and Dried Fish Products in Makati City.',
    categoryRef: {
      connect: {
        category_name: "Food & Beverages"
      }
    },
    banner: 'https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLAS1akgYZgnkwToRlBxMq3uOmGt96fKcZCsrWi',
    logo: 'https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLAx7h2Cy8rOKNzis24n6wCm8ghdLaUJtoPFQ15',
    address: 'Tower C Jazz Residences, N. Garcia St., Brgy. Bel-Air',
    contact_number: '09694345652',
  }, { city: 'Makati', province: 'NCR', postal_code: '1209' }, [
    { name: 'Tinapang Tunsoy', type: 'PRODUCT', price: 240, description: 'Smoked fish', media: ['https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLAwHhDzy0XpksdUhT9jLR2AgKZ4YatzCylHeXS'] },
    { name: 'Tinapang Babae', type: 'PRODUCT', price: 260, description: 'Smoked fish', media: ['https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLAy8fPrrhd4C3ZmIL8eWhoF9V0zgnkuPlcbBMH'] },
    { name: 'Tinapang Lalaki', type: 'PRODUCT', price: 280, description: 'Smoked fish', media: ['https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLA1kltKnzJ1LV5SDYv4XcBHMpbeiAdFnjG09my'] },
    { name: 'Tinapang Bangus', type: 'PRODUCT', price: 310, description: 'Smoked fish', media: ['https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLAQFgw0jr4Hpwf0JT7zqod1e2YI5Pc6MViyvtU'] }
  ]);

  await addBusinessWithOwner(createdUsers['BUSINESSOWNER_67f94c3082299e43bbdd02bc'], {
    business_name: 'Beamfresh Water Refilling Station',
    description: 'Water refilling station.',
    categoryRef: {
      connect: {
        category_name: "Utilities & Services"
      }
    },
    banner: 'https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLAYndSKqxKELc0TedjOU9BsxZlqRwMof3D1Nkp',
    logo: 'https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLAkPMYpgarngDG5HOehxEbSC0P7Kt49L8TXlIF',
    address: '194 Camastilisan',
    contact_number: '09958552475',
  }, { city: 'Calaca', province: 'Batangas', postal_code: '4212' }, [
    { name: 'Purified Water', type: 'SERVICE', price: 25, description: 'Clean water gallon', media: ['https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLAmz6Rq9I1TaSOFsHz2qKePjd6R17CuV3kL8xU'] },
  ]);

  await addBusinessWithOwner(createdUsers['BUSINESSOWNER_67f94c3082299e43bbdd02bd'], {
    business_name: 'Hamellek Hog & Poultry Supply',
    description: 'Selling feeds, vitamins, and other needs for happy and healthy farm animals.',
    categoryRef: {
      connect: {
        category_name: "Agricultural Supplies"
      }
    },
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
  ]);

  // 3 UNVERIFIED BUSINESSES
  await addBusinessWithOwner(createdUsers['BUSINESSOWNER_67f94c3182299e43bbdd02c1'], {
    business_name: 'Unverified Business #1',
    description: 'Unverified placeholder biz.',
    categoryRef: {
      connect: {
        category_name: "Utilities & Services"
      }
    },
    banner: 'https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLAxgJ4uE8rOKNzis24n6wCm8ghdLaUJtoPFQ15',
    logo: 'https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLAmzuajMe1TaSOFsHz2qKePjd6R17CuV3kL8xU',
    address: '194 Camastilisan',
    contact_number: '09111222333',
  }, { city: 'Calaca', province: 'Batangas', postal_code: '4212' }, [
    { name: 'Placeholder Product', type: 'PRODUCT', price: 25, description: 'Placeholder product', media: ['https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLAKhGyOOUIQlsiA6u9gbrXkBLpe5z1Ca3UcEDY'] },
  ]);

  await addBusinessWithOwner(createdUsers['BUSINESSOWNER_67f94c3282299e43bbdd02c2'], {
    business_name: 'Unverified Business #2',
    description: 'Unverified placeholder biz.',
    categoryRef: {
      connect: {
        category_name: "Technology"
      }
    },
    banner: 'https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLAxgJ4uE8rOKNzis24n6wCm8ghdLaUJtoPFQ15',
    logo: 'https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLAmzuajMe1TaSOFsHz2qKePjd6R17CuV3kL8xU',
    address: '194 Camastilisan',
    contact_number: '09111222333',
  }, { city: 'Calaca', province: 'Batangas', postal_code: '4212' }, [
    { name: 'Placeholder Product', type: 'PRODUCT', price: 25, description: 'Placeholder product', media: ['https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLAKhGyOOUIQlsiA6u9gbrXkBLpe5z1Ca3UcEDY'] },
  ]);

  await addBusinessWithOwner(createdUsers['BUSINESSOWNER_67f94c3282299e43bbdd02c3'], {
    business_name: 'Unverified Business #3',
    description: 'Unverified placeholder biz.',
    categoryRef: {
      connect: {
        category_name: "Technology"
      }
    },
    banner: 'https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLAxgJ4uE8rOKNzis24n6wCm8ghdLaUJtoPFQ15',
    logo: 'https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLAmzuajMe1TaSOFsHz2qKePjd6R17CuV3kL8xU',
    address: '194 Camastilisan',
    contact_number: '09111222333',
  }, { city: 'Calaca', province: 'Batangas', postal_code: '4212' }, [
    { name: 'Placeholder Product', type: 'PRODUCT', price: 25, description: 'Placeholder product', media: ['https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLAKhGyOOUIQlsiA6u9gbrXkBLpe5z1Ca3UcEDY'] },
  ]);

  const customerKey = Object.keys(createdUsers).find(key => key.includes('CUSTOMER'));
  const customer = createdUsers[customerKey ? customerKey : 'CUSTOMER_67f94c2f82299e43bbdd02b9']; 
  const businesses = await prisma.business.findMany({ include: { sellables: true } });

    // Then use it for transactions
    for (let i = 0; i < 3; i++) {
    if (!customer || !customer.user_id) {
        console.error("Invalid customer object:", customer);
        continue; // Skip this iteration if customer is invalid
    }

    const transaction = await prisma.transaction.create({
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
    });

    await prisma.dispute.create({
      data: {
        transaction: { connect: { transaction_id: transaction.transaction_id } },
        complainant: { connect: { user_id: customer.user_id } },
        reason: `Dispute reason for transaction ${i + 1}`,
        status: 'PENDING'
      }
    });

    await prisma.review.create({
      data: {
        customer: { connect: { user_id: customer.user_id } },
        business: { connect: { business_id: businesses[i].business_id } },
        rating: 5,
        review_text: `This is a review for business ${i + 1}`,
        media: [`https://6v5e0ohgur.ufs.sh/f/MOFsf8KgsHLAC8huOaYKdyxZbR5I3Vjs4mo7lYPXcWkGO26p`],
        is_verified: true
      }
    });
  }

  console.log('🎉 Seed completed');
}

seed()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
