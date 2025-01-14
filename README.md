
# Тестовое задание на вёрстку для компании tPlace

Добро пожаловать в репозиторий с результатами выполнения тестового задания для компании **tPlace**. Этот проект демонстрирует использование современных инструментов фронтенд-разработки, таких как Rollup, Pug и SCSS.

---

## 📂 Структура проекта

```
tplace/
├── src/                  # Исходные файлы проекта
│   ├── icons/            # SVG-иконки
│   ├── pug/              # Pug-шаблоны
│   ├── scss/             # SCSS-стили
│   ├── main.js           # Точка входа для JS
├── build/                # Скомпилированные файлы (результат сборки)
│   ├── bundle.js         # Скомпилированный JS
│   ├── bundle.css        # Скомпилированный CSS
│   ├── sprite.svg        # SVG-спрайт
├── rollup.config.cjs     # Конфигурация Rollup
├── package.json          # Настройки проекта и зависимости
└── README.md             # Описание проекта
```

---

## 🚀 Используемые технологии

- **Rollup** — для сборки JavaScript, SCSS и Pug-шаблонов.
- **Pug** — для создания компонентов и шаблонов.
- **SCSS** — для написания модульных и переиспользуемых стилей.
- **SVG-спрайты** — для оптимизированной работы с иконками.

---

## 🔧 Установка и запуск

### 1. Клонирование репозитория
```bash
git clone https://github.com/username/tplace-test.git
cd tplace-test
```

### 2. Установка зависимостей
Убедитесь, что у вас установлен Node.js (версия 16 или выше).
```bash
npm install
```

### 3. Запуск проекта
Для запуска локального сервера:
```bash
npx rollup --config --watch
```

После этого проект будет доступен по адресу: [http://localhost:10002](http://localhost:10002)

---

## 📜 Основные задачи

1. **Адаптивная вёрстка**:
   - Вся вёрстка выполнена с учётом разных разрешений экранов (mobile-first подход).
   - Использованы медиазапросы для адаптации под устройства.

2. **Модульный код**:
   - Каждый компонент вынесен в отдельный Pug-шаблон и SCSS-модуль.
   - Логика и стили разделены для удобной поддержки.

3. **SVG-спрайт**:
   - Для работы с иконками используется SVG-спрайт, собранный автоматически.

4. **Оптимизация**:
   - Минимизированные стили и JavaScript для улучшения производительности.

---

## 🖼️ Превью проекта

### Десктопная версия
![Desktop Preview](https://via.placeholder.com/800x400?text=Desktop+Preview)

### Мобильная версия
![Mobile Preview](https://via.placeholder.com/400x800?text=Mobile+Preview)

---

## 🛠 Используемые зависимости

```json
{
  "devDependencies": {
    "rollup": "^3.0.0",
    "rollup-plugin-scss": "^4.0.0",
    "rollup-plugin-pug": "^2.0.0",
    "rollup-plugin-serve": "^1.0.1",
    "sass": "^1.64.2"
  }
}
```

---

## 📞 Контакты

- **Имя:** Иван Матвеев
- **Email:** ivan.matveev@example.com
- **GitHub:** [github.com/username](https://github.com/username)

Спасибо за внимание! 🙂
