# template by Murat v: 1.2.0

### Запуск проекта
```
npm i - установка пакетов
npm start - запуск сервера
npm run watch-js - сборка js файлов из js-src в папку js и слежение
npm run test - проверка файлов
npm run build - сборка проекта в папку build
npm run deploy - сборка проекта в gh-pages
```

### Структура папок и файлов
```
├── source/                    #
│   ├── css/                   #
│   │   └── blocks/            #
│   │   │   └── block.scss     #
|   |   ├── _mixins.scss       #
|   |   ├── _scaffolding.scss  #
|   |   ├── _variables.scss    #
|   |   ├── style.scss         #
|   |   └── style.css          #
│   ├── fonts/                 #
│   ├── img/                   #
│   ├── js/                    #
│   │   └── script.js          #
├── build/                     #
│   ├── css/                   #
│   │   └── style.min.css      #
│   ├── fonts/                 #
│   ├── img/                   #
│   ├── js/                    #
│   │   └── script.min.js      #
│   └── index.html             #
└── README.md                  #
