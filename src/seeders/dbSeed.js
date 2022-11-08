const { User, StadiumDetail, Admin } = require('../models');
const bcrypt = require('bcryptjs');

const InitDataSeed = async () => {
  const hashpassword = await bcrypt.hash('123456789', 12);
  const userData = [
    {
      firstName: 'May',
      lastName: 'ApinYa',
      email: 'may@gmail.com',
      password: hashpassword,
      phoneNumber: '0943292941'
    }
  ];

  const adminData = [
    {
      firstName: 'Admin',
      lastName: 'MaMay',
      email: 'admin@gmail.com',
      password: hashpassword,
      phoneNumber: '08636637502'
    }
  ];

  const stadiumDetailData = [
    {
      stadiumName: 'สนาม1',
      price: 300,
      facility: 'ทีวี, ห้องน้ำ, อาหารเครื่องดื่ม',
      openTime: '8.00',
      closeTime: '24.00',
      image:
        'https://res.cloudinary.com/p2cstadium/image/upload/v1665258155/p2c/stadium/stadium-img_p0saia.png'
    },
    {
      stadiumName: 'สนาม2',
      price: 500,
      facility: 'ทีวี, ห้องน้ำ, อาหารเครื่องดื่ม',
      openTime: '8.00',
      closeTime: '24.00',
      image:
        'https://res.cloudinary.com/p2cstadium/image/upload/v1667617689/p2c/stadium/ssd5_sgqgvg.jpg'
    },
    {
      stadiumName: 'สนามบนเขา',
      price: 2500,
      facility: 'ทีวี, ห้องน้ำ, อาหารเครื่องดื่ม',
      openTime: '8.00',
      closeTime: '24.00',
      image:
        'https://res.cloudinary.com/p2cstadium/image/upload/v1667616072/p2c/stadium/ss2_daafvh.jpg'
    },
    {
      stadiumName: 'สนาม4',
      price: 450,
      facility: 'ทีวี, ห้องน้ำ, อาหารเครื่องดื่ม',
      openTime: '8.00',
      closeTime: '24.00',
      image:
        'https://res.cloudinary.com/p2cstadium/image/upload/v1667616071/p2c/stadium/ss3_qza880.jpg'
    }
  ];

  // insert data to db;
  let resUser = await User.bulkCreate(userData);
  let resStadiumDetail = await StadiumDetail.bulkCreate(stadiumDetailData);
  let resAdmin = await Admin.bulkCreate(adminData);

  //console.log(res);
  process.exit(0);
};

InitDataSeed();
