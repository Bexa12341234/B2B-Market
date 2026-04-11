'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'uz' | 'ru';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  uz: {
    dashboard: 'Boshqaruv paneli',
    users: 'Foydalanuvchilar',
    segments: 'Segmentlar',
    categories: 'Kategoriyalar',
    orders: 'Buyurtmalar',
    my_products: 'Mening mahsulotlarim',
    incoming_orders: 'Buyurtmalar (Kelim)',
    catalog: 'Katalog',
    my_orders: 'Mening buyurtmalarim',
    pos: 'Kassa (POS)',
    history: 'Sotuv tarixi',
    logout: 'Chiqish',
    admin_panel: 'Admin paneli',
    supplier_panel: 'Yetkazib beruvchi paneli',
    retail_panel: 'Do\'kon paneli',
    loading: 'Yuklanmoqda...',
    profile: 'Mening profilim',
    close: 'Yopish',
    phone: 'Telefon',
    address: 'Manzil',
    role: 'Rol',
    name: 'Ism',
    save: 'Saqlash',
    total: 'Jami',
    status: 'Holat',
    search: 'Qidirish...',
    add_to_cart: 'Savatga',
    finish_sale: 'Sotuvni yakunlash',
    markup: 'Ustiga qo\'yish',
    profit: 'Sof foyda',
    cost: 'Tan narxi',
    hero_title: 'Zamonaviy B2B Ekotizimi',
    hero_subtitle: 'Yetkazib beruvchilar va chakana savdo nuqtalarini bog\'lovchi xavfsiz va yopiq platforma. Ulgurji savdo operatsiyalaringizni ilg\'or kassa va buyurtmalar tizimi bilan osonlashtiring.',
    supplier_hero: 'Yetkazib beruvchilar',
    supplier_hero_desc: 'Mahsulotlar katalogini, maxsus takliflarni va ulgurji buyurtmalarni bir joyda boshqaring.',
    supplier_portal: 'Yetkazib beruvchi portali',
    retail_hero: 'Do\'konlar',
    retail_hero_desc: 'Eksklyuziv takliflarni ko\'ring, zaxiralarni boshqaring va kassa terminali orqali soting.',
    retail_portal: 'Retail portali',
    admin_hero: 'Admin',
    admin_hero_desc: 'Bozor, foydalanuvchilar, segmentlar va global statistika ustidan to\'liq nazorat.',
  },
  ru: {
    dashboard: 'Панель управления',
    users: 'Пользователи',
    segments: 'Сегменты',
    categories: 'Категории',
    orders: 'Заказы',
    my_products: 'Мои товары',
    incoming_orders: 'Входящие заказы',
    catalog: 'Каталог',
    my_orders: 'Мои заказы',
    pos: 'Касса (POS)',
    history: 'История продаж',
    logout: 'Выйти',
    admin_panel: 'Панель администратора',
    supplier_panel: 'Панель поставщика',
    retail_panel: 'Панель магазина',
    loading: 'Загрузка...',
    profile: 'Мой профиль',
    close: 'Закрыть',
    phone: 'Телефон',
    address: 'Адрес',
    role: 'Роль',
    name: 'Имя',
    save: 'Сохранить',
    total: 'Итого',
    status: 'Статус',
    search: 'Поиск...',
    add_to_cart: 'В корзину',
    finish_sale: 'Завершить продажу',
    markup: 'Наценка',
    profit: 'Чистая прибыль',
    cost: 'Себестоимость',
    total_users: 'Всего пользователей',
    add_new_user: 'Добавить нового пользователя',
    users_list: 'Пользователи',
    add_new: 'Добавить новый',
    edit_user: 'Редактировать пользователя',
    user_name: 'Имя',
    user_phone: 'Телефон номер',
    user_location: 'Локация/Адрес',
    user_role: 'Роль',
    user_segment: 'Сегмент',
    actions: 'Действия',
    edit: 'Редактировать',
    delete: 'Удалить',
    cancel: 'Отмена',
    password: 'Пароль',
    new_password: 'Новый пароль',
    detect_location: 'Определить',
    segments_list: 'Сегменты',
    categories_list: 'Категории',
    name_label: 'Название',
    create_category: 'Создать новую категорию',
    category_name: 'Название категории',
    all_orders: 'Все заказы',
    client_shop: 'Магазин (Клиент)',
    suppliers: 'Поставщики',
    total_amount: 'Общая сумма',
    login_title: 'Вход в систему',
    phone_number: 'Номер телефона',
    submit_login: 'Войти',
    placeholder_phone: '+998...',
    placeholder_pass: 'Ваш пароль',
    profile_title: 'Мой профиль',
    your_name: 'Ваше имя',
    your_phone: 'Ваш номер телефона',
    your_role: 'Ваша роль',
    role_admin: 'Админ',
    role_supplier: 'Поставщик',
    role_retail: 'Магазин (Ритейлер)',
    active_segments: 'Активные сегменты',
    total_orders: 'Всего заказов',
    quick_actions: 'Быстрые действия',
    add_segment: 'Добавить сегмент',
    add_category: 'Добавить категорию',
    system_log: 'Журнал системы',
    all_categories: 'Все категории',
    your_order: 'Ваш заказ',
    cart_empty: 'Корзина пуста',
    details: 'Подробнее',
    sales_history_archive: 'История продаж (Архив)',
    sale_number: 'Продажа',
    active_offers: 'Активные предложения',
    new_orders: 'Новые заказы',
    image_label: 'Фото',
    limit_segment: 'Ограничение (Сегмент)',
    visible_to_all: 'Видно всем',
    customer_orders: 'Заказы моих клиентов',
    date_label: 'Дата',
    no_actions: 'Нет действий',
    retailer_details: 'Информация о магазине',
    confirm_order: 'Подтвердить',
    reject_order: 'Отклонить',
    pos_settings: 'Настройки кассы',
    total_cost_price: 'Общая себестоимость',
    final_price: 'Итоговая цена',
    markup_helper: 'Этот процент автоматически добавляется к себестоимости и отображается покупателю как итоговая цена.',
    select_product: 'Выберите товар',
    cart_pos: 'Корзина (POS)',
    hero_title: 'Современная B2B Экосистема',
    hero_subtitle: 'Безопасная и закрытая платформа, соединяющая поставщиков и розничные торговые точки. Упростите свои оптовые операции с помощью передовой системы кассового обслуживания и заказов.',
    supplier_hero: 'Поставщики',
    supplier_hero_desc: 'Управляйте каталогом товаров, спецпредложениями и оптовыми заказами в одном месте.',
    supplier_portal: 'Портал поставщика',
    retail_hero: 'Магазины',
    retail_hero_desc: 'Просматривайте эксклюзивные предложения, управляйте запасами и продавайте через кассовый терминал.',
    retail_portal: 'Ритейл портал',
    admin_hero: 'Админ',
    admin_hero_desc: 'Полный контроль над рынком, пользователями, сегментами и глобальной статистикой.',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language] = useState<Language>('ru'); // Strictly Russian as requested

  const t = (key: string) => {
    return (translations[language] as any)[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: () => {}, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
