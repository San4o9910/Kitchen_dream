export const bookSources = {
  samarkand: {
    title: 'Samarkand: Recipes & Stories from Central Asia & the Caucasus',
    authors: 'Caroline Eden, Eleanor Ford',
    rating: '4,32/5',
    ratingDate: '30.07.2026',
    url: 'https://www.goodreads.com/book/show/27134710-samarkand'
  },
  kachka: {
    title: 'Kachka: A Return to Russian Cooking',
    authors: 'Bonnie Frumkin Morales, Deena Prichep',
    rating: '4,41/5',
    ratingDate: '30.07.2026',
    url: 'https://www.goodreads.com/book/show/32768511-kachka'
  },
  mamushka: {
    title: 'Mamushka: Recipes from Ukraine and Eastern Europe',
    authors: 'Olia Hercules',
    rating: '4,26/5',
    ratingDate: '30.07.2026',
    url: 'https://www.goodreads.com/book/show/25152055-mamushka'
  },
  foodlab: {
    title: 'The Food Lab: Better Home Cooking Through Science',
    authors: 'J. Kenji López-Alt',
    rating: '4,31/5',
    ratingDate: '30.07.2026',
    url: 'https://www.goodreads.com/book/show/25454364-the-food-lab'
  },
  saltfat: {
    title: 'Salt, Fat, Acid, Heat',
    authors: 'Samin Nosrat',
    rating: '4,39/5',
    ratingDate: '30.07.2026',
    url: 'https://www.goodreads.com/book/show/34374423-salt-fat-acid-heat'
  },
  joy: {
    title: 'Joy of Cooking',
    authors: 'Irma S. Rombauer, Marion Rombauer Becker, Ethan Becker',
    rating: '4,12/5',
    ratingDate: '30.07.2026',
    url: 'https://www.goodreads.com/book/show/75205.Joy_of_Cooking'
  },
  silver: {
    title: 'The Silver Spoon',
    authors: 'The Silver Spoon Kitchen / Phaidon',
    rating: '4,10/5',
    ratingDate: '30.07.2026',
    url: 'https://www.goodreads.com/book/show/11476271-the-silver-spoon'
  },
  nordic: {
    title: 'The Nordic Cookbook',
    authors: 'Magnus Nilsson',
    rating: '4,39/5',
    ratingDate: '30.07.2026',
    url: 'https://www.goodreads.com/book/show/25208269-the-nordic-cookbook'
  }
};

export const mediaLibrary = {
  plov: {
    url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Riz_pilaf.jpg?width=1200',
    caption: 'Рис готовится в ароматной основе — реальный этап приготовления плова.',
    author: 'Dereckson', license: 'CC BY 3.0',
    source: 'https://commons.wikimedia.org/wiki/File:Riz_pilaf.jpg'
  },
  onions: {
    url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Chopped_Onions.JPG?width=1200',
    caption: 'Нарезанный лук — базовый этап для супов, тушёных блюд и соусов.',
    author: 'DrCruse', license: 'CC BY-SA 3.0',
    source: 'https://commons.wikimedia.org/wiki/File:Chopped_Onions.JPG'
  },
  rawMeatballs: {
    url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Raw_meatballs.jpg?width=1200',
    caption: 'Сформированные мясные полуфабрикаты перед тепловой обработкой.',
    author: 'Tiia Monto', license: 'CC BY-SA 3.0',
    source: 'https://commons.wikimedia.org/wiki/File:Raw_meatballs.jpg'
  },
  meatballs: {
    url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Meatballs-257960_640.jpg?width=1200',
    caption: 'Готовые мясные шарики после равномерного обжаривания.',
    author: 'Pixabay contributor', license: 'CC0',
    source: 'https://commons.wikimedia.org/wiki/File:Meatballs-257960_640.jpg'
  },
  soup: {
    url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Chicken_soup%2C_Zutaten_im_Topf.JPG?width=1200',
    caption: 'Курица и овощи в кастрюле во время приготовления бульона.',
    author: 'Claus Ableiter', license: 'CC BY-SA 3.0',
    source: 'https://commons.wikimedia.org/wiki/File:Chicken_soup,_Zutaten_im_Topf.JPG'
  },
  pasta: {
    url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Pasta_boiling.jpg?width=1200',
    caption: 'Паста варится в большом количестве кипящей воды.',
    author: 'MarkTraceur', license: 'CC BY-SA 3.0',
    source: 'https://commons.wikimedia.org/wiki/File:Pasta_boiling.jpg'
  },
  fish: {
    url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Fish_Fry_Pan.jpg?width=1200',
    caption: 'Рыба готовится порционными кусками на сковороде.',
    author: 'Adbh266', license: 'CC BY-SA 4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Fish_Fry_Pan.jpg'
  },
  stew: {
    url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Boiled_Stew.jpg?width=1200',
    caption: 'Тушёное блюдо на стадии медленного приготовления.',
    author: 'Taoheedah', license: 'CC BY-SA 4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Boiled_Stew.jpg'
  }
};

export const source = (book, technique, note) => ({ book, technique, note });
export const prep = (title, pack, label, packageCount, freezer) => ({ title, pack, label, packageCount, freezer });
