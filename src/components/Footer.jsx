import {useTranslation} from "react-i18next";

function Footer() {

    const {t} = useTranslation();

    return (
        <footer className="bg-dark text-white p-3 text-center">
        <p><span>&copy;</span> {t("website_created_by_Filip_Dziopa")}</p>
        </footer>
    )
}
export default Footer;