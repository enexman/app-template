# template by Murat v: 1.0.3

### Запуск проекта
```
npm i - установка пакетов
npm start - запуск сервера
npm run build - сборка проекта в папку build
npm run watch - сборка js файлов из js-src в папку js
npm run deploy - отправка содержимого папки build на хостинг
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
│   │   └── main.js            #
├── build/                     #
│   ├── css/                   #
│   │   └── style.min.css      #
│   ├── fonts/                 #
│   ├── img/                   #
│   ├── js/                    #
│   │   └── script.min.js      #
│   └── index.html             #
└── README.md                  #
