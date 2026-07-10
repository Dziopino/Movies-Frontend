import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
    en: {
        translation: {
            username: "Username",
            email: "E-mail",
            you_can_add_only_images:"You can add only images!",
            file_is_too_large:"File is too large (Max 2MB)",
            enter_your_bio: "Enter your bio",
            add_bio: "Add bio",
            view_profile_picture:"View profile picture",
            choose_a_profile_picture:"Choose a profile picture",
            enter_your_new_username:"Enter your new username",
            choose_your_language: "Choose your language",
            confirm: "Confirm",
            cancel: "Cancel",
            favorites: "Favorites",
            website_created_by_Filip_Dziopa:"Website created by Filip Dziopa",
            home: "Home",
            watched: "Watched",
            account: "My account",
            logout:"Logout",
            sign_in: "Sign in",
            log_in: "Log in",
            genres: "Genres",
            duration: "Duration",
            release_date: "Release date",
            movies: "Movies",
            search: "Search...",
            bio:"Bio"
        }
    },
    pl: {
        translation: {
            username: "Nazwa użytkownika",
            email: "E-mail",
            you_can_add_only_images:"Możesz dodać tylko obrazki!",
            file_is_too_large:"Plik jest za duży (Maks 2MB)",
            enter_your_bio: "Podaj swój opis",
            add_bio: "Dodaj opis",
            view_profile_picture:"Wyświetl zdjecie profilowe",
            choose_a_profile_picture:"Wybierz zdjęcie profilowe",
            enter_your_new_username:"Podaj swoją nową nazwe użytkownika",
            choose_your_language: "Wybierz język",
            confirm: "Zatwierdź",
            cancel: "Anuluj",
            favorites: "Ulubione",
            website_created_by_Filip_Dziopa:"Strona stworzona przez Filipa Dziope",
            home: "Strona Główna",
            watched:"Obejrzane",
            account:"Moje konto",
            logout:"Wyloguj się",
            sign_in: "Zarejestruj się",
            log_in: "Zaloguj się",
            genres: "Gatunki",
            duration: "Czas trwania",
            release_date: "Data wydania",
            movies: "Filmy",
            search: "Szukaj...",
            bio:"Opis"
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: localStorage.getItem("language_code") || "en",
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;