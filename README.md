# template by Murat v: 0.2.0

### Запуск проекта
```
npm i - установка пакетов
npm run links - подключение файлов из папки bower (bower list --path)
npm start - запуск сервера
npm run build - сборка проекта в директорию dist
npm run deploy - отправка содержимого папки dist на хостинг
```

### Структура папок и файлов
```
├── app/                       # 
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
├── dist/                      # 
│   ├── css/                   # 
│   │   └── style.min.css      # 
│   ├── images/                # 
│   ├── js/                    # 
│   │   └── main.min.js        # 
│   ├── fonts/                 # 
│   ├── humans.txt             # 
│   ├── robots.txt             # 
│   ├── 404.html               # 
│   └── index.html             # 
└── README.md                  # 
