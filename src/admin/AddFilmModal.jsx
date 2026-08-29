import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Trash2, Plus, Upload, X } from "lucide-react";
import { apiRequest } from "../services/apiService.js";

function AddFilmModal({ isOpen, onClose, onConfirm }) {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({ rating: "", release_date: "", duration: ""});
    const [posterFile, setPosterFile] = useState(null);
    const [posterFileName, setPosterFileName] = useState("");
    const [translations, setTranslations] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [genreSearchTerms, setGenreSearchTerms] = useState([]);
    const [allGenres, setAllGenres] = useState([]);

    useEffect(() => {
        if (isOpen) {
            apiRequest("getLanguageCodes")
                .then(data => {
                    if (data.body) {
                        setLanguages(data.body);
                    }
                }).catch(err => console.error("Error loading languages:", err));

            apiRequest("getGenres?page=1&limit=1000")
                .then(data => {
                    if (data.success && data.genres) {
                        setAllGenres(data.genres);
                    }
                }).catch(err => console.error("Error loading genres:", err));
        }
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }

    const handlePosterChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert(t("you_can_add_only_images"));
            return;
        }

        const img = new Image();
        const reader = new FileReader();

        reader.onload = (event) => {
            img.src = event.target.result;
        };

        img.onload = async () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = 200;
            canvas.height = 285;

            ctx.drawImage(img, 0, 0, 200, 285);

            canvas.toBlob((blob) => {
                const timestamp = Date.now();
                const fileName = `poster_${timestamp}.webp`;
                const webpFile = new File([blob], fileName, { type: 'image/webp' });
                setPosterFile(webpFile);
                setPosterFileName(fileName);
            }, 'image/webp', 0.9);
        };
        reader.readAsDataURL(file);
    };

    const removePoster = () => {
        setPosterFile(null);
        setPosterFileName("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!posterFile || !formData.rating || !formData.release_date || !formData.duration || translations.length === 0) {
            return;
        }

        const rating = parseFloat(formData.rating);
        if (rating < 0 || rating > 10) {
            return;
        }

        onConfirm({
            ...formData,
            posterFile: posterFile,
            posterFileName: posterFileName,
            rating: rating,
            duration: parseInt(formData.duration),
            translations: translations,
            genres: selectedGenres
        });
        setFormData({ rating: "", release_date: "", duration: "" });
        setPosterFile(null);
        setPosterFileName("");
        setTranslations([]);
        setSelectedGenres([]);
        setGenreSearchTerms([]);
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleClose = () => {
        setFormData({ rating: "", release_date: "", duration: "" });
        setPosterFile(null);
        setPosterFileName("");
        setTranslations([]);
        setSelectedGenres([]);
        setGenreSearchTerms([]);
        onClose();
    };

    const addTranslation = () => {
        const availableLanguages = languages.filter(lang =>
            !translations.some(t => t.lang_code === lang.code)
        );

        setTranslations(prev => [...prev, {
            lang_code: availableLanguages.length > 0 ? availableLanguages[0].code : "",
            title: "",
            description: ""
        }]);
    };

    const removeTranslation = (index) => {
        setTranslations(prev => prev.filter((_, i) => i !== index));
    };

    const updateTranslation = (index, field, value) => {
        setTranslations(prev => prev.map((trans, i) =>
            i === index ? { ...trans, [field]: value } : trans
        ));
    };

    const getAvailableLanguages = (currentIndex) => {
        const selectedLanguages = translations
            .map((t, i) => i !== currentIndex ? t.lang_code : null)
            .filter(code => code !== null && code !== "");
        return languages.filter(lang => !selectedLanguages.includes(lang.code));
    };

    const addGenre = () => {
        setSelectedGenres(prev => [...prev, null]);
        setGenreSearchTerms(prev => [...prev, ""]);
    };

    const removeGenre = (index) => {
        setSelectedGenres(prev => prev.filter((_, i) => i !== index));
        setGenreSearchTerms(prev => prev.filter((_, i) => i !== index));
    };

    const selectGenre = (index, genreId) => {
        setSelectedGenres(prev => prev.map((g, i) => i === index ? genreId : g));
        setGenreSearchTerms(prev => prev.map((term, i) => i === index ? "" : term));
    };

    const updateGenreSearchTerm = (index, term) => {
        setGenreSearchTerms(prev => prev.map((t, i) => i === index ? term : t));
    };

    const getAvailableGenres = (currentIndex) => {
        const selected = selectedGenres.filter((g, i) => g !== null && i !== currentIndex);
        return allGenres.filter(genre => !selected.includes(genre.id));
    };

    const getFilteredGenres = (index) => {
        const available = getAvailableGenres(index);
        const searchTerm = genreSearchTerms[index] || "";

        if (!searchTerm.trim()) {
            return available;
        }

        return available.filter(genre => genre.name.toLowerCase().includes(searchTerm.toLowerCase()));
    };

    const isFormValid = () => {
        if (!posterFile || !formData.rating ||
            !formData.release_date || !formData.duration) {
            return false;
        }

        if (translations.length === 0) {
            return false;
        }

        const hasInvalidTranslation = translations.some(t =>
            !t.lang_code || !t.title.trim()
        );

        if (hasInvalidTranslation) {
            return false;
        }

        const rating = parseFloat(formData.rating);
        if (isNaN(rating) || rating < 0 || rating > 10) {
            return false;
        }

        const duration = parseInt(formData.duration);
        if (isNaN(duration) || duration <= 0) {
            return false;
        }

        return true;
    };

    return (
        <div className="admin-modal-overlay">
            <form className="admin-modal" onSubmit={handleSubmit} style={{ maxHeight: "90vh", overflowY: "auto" }}>
                <h3 className="text-light">{t("add_film")}</h3>

                <p className="mt-3 text-light fw-semibold">{t("film_poster")}</p>

                {!posterFile ? (
                    <div className="mt-2">
                        <label htmlFor="poster_file" className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center" style={{ cursor: "pointer", padding: "0.75rem" }}>
                            <Upload size={20} className="me-2" />
                            {t("choose_poster_file")}
                        </label>
                        <input id="poster_file" type="file" accept="image/*" style={{ display: "none" }} onChange={handlePosterChange}/>
                    </div>
                ) : (
                    <div className="mt-2 card bg-dark border-secondary p-3">
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                                <Upload size={18} className="me-2 text-success" />
                                <div>
                                    <div className="text-light small fw-semibold">{posterFileName}</div>
                                    <div className="text-muted" style={{ fontSize: "0.75rem" }}>200x285px, WebP</div>
                                </div>
                            </div>
                            <button type="button" className="btn btn-sm btn-outline-danger" onClick={removePoster} title={t("remove")}>
                                <X size={16} />
                            </button>
                        </div>
                    </div>
                )}

                <label className="mt-3 text-light fw-semibold" htmlFor="rating">{t("rating")} (0-10)</label>
                <input id="rating" type="number" step="0.1" min="0" max="10" className="form-control mt-2" placeholder={t("enter_rating")} value={formData.rating} onChange={(e) => handleChange("rating", e.target.value)}/>

                <label className="mt-3 text-light fw-semibold" htmlFor="release_date">{t("release_date")}</label>
                <input id="release_date" type="date" className="form-control mt-2" value={formData.release_date} onChange={(e) => handleChange("release_date", e.target.value)}/>

                <label className="mt-3 text-light fw-semibold" htmlFor="duration">{t("duration")} ({t("minutes")})</label>
                <input id="duration" type="number" min="1" className="form-control mt-2" placeholder={t("enter_duration")} value={formData.duration} onChange={(e) => handleChange("duration", e.target.value)}/>

                <div className="mt-4">
                    <h5 className="mb-3 text-light">{t("translations")}</h5>

                    {translations.map((translation, index) => (
                        <div key={index} className="card bg-dark border-secondary p-3 mb-3">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <span className="text-light fw-semibold small">{t("translation")} #{index + 1}</span>
                                <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeTranslation(index)} title={t("remove")}>
                                    <Trash2 size={14} />
                                </button>
                            </div>

                            <label className="mt-2 small text-light fw-semibold" htmlFor={`lang_code_${index}`}>{t("language")}</label>
                            <select id={`lang_code_${index}`} className="form-select form-select-sm mt-1" value={translation.lang_code} onChange={(e) => updateTranslation(index, "lang_code", e.target.value)}>
                                {getAvailableLanguages(index).map(lang => (
                                    <option key={lang.code} value={lang.code}>
                                        {lang.name} ({lang.code.toUpperCase()})
                                    </option>
                                ))}
                            </select>

                            <label className="mt-2 small text-light fw-semibold" htmlFor={`title_${index}`}>{t("title")}</label>
                            <input id={`title_${index}`} type="text" className="form-control form-control-sm mt-1" placeholder={t("enter_film_title")} value={translation.title} onChange={(e) => updateTranslation(index, "title", e.target.value)}/>

                            <label className="mt-2 small text-light fw-semibold" htmlFor={`description_${index}`}>{t("description")}</label>
                            <textarea id={`description_${index}`} className="form-control form-control-sm mt-1" rows="3" placeholder={t("enter_description")} value={translation.description} onChange={(e) => updateTranslation(index, "description", e.target.value)}/>
                        </div>
                    ))}

                    {translations.length < languages.length && (
                        <button type="button" className="btn btn-outline-secondary btn-sm w-100" onClick={addTranslation}><Plus size={16} className="me-1" />{t("add_translation")}</button>
                    )}
                </div>

                <div className="mt-4">
                    <h5 className="mb-3 text-light">{t("genres")}</h5>

                    {selectedGenres.map((genreId, index) => (
                        <div key={index} className="card bg-dark border-secondary p-3 mb-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <span className="text-light fw-semibold small">{t("genre")} #{index + 1}</span>
                                <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeGenre(index)} title={t("remove")}><Trash2 size={14} /></button>
                            </div>

                            {!genreId ? (
                                <>
                                    <label className="mt-2 small text-light fw-semibold" htmlFor={`genre_search_${index}`}>{t("select_genre")}</label>
                                    <input id={`genre_search_${index}`} type="text" className="form-control form-control-sm mt-1 mb-2" placeholder={t("search_genre")} value={genreSearchTerms[index] || ""} onChange={(e) => updateGenreSearchTerm(index, e.target.value)}/>

                                    <div className="genre-list border border-secondary rounded" style={{ maxHeight: "150px", overflowY: "auto", backgroundColor: "#1a1d20" }}>
                                        {getFilteredGenres(index).length > 0 ? (
                                            getFilteredGenres(index).map(genre => (
                                                <div key={genre.id} className="genre-option p-2 border-bottom border-secondary text-light" style={{ cursor: "pointer", transition: "background-color 0.2s" }} onClick={() => selectGenre(index, genre.id)}
                                                     onMouseEnter={(e) => {
                                                        e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.backgroundColor = "transparent";
                                                    }}
                                                >
                                                    {genre.name}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-light small p-2">
                                                {t("no_genres_found")}
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="mt-2 d-flex align-items-center">
                                    <span className="text-success fw-semibold">✓</span>
                                    <span className="text-light ms-2">{allGenres.find(g => g.id === genreId)?.name}</span>
                                </div>
                            )}
                        </div>
                    ))}

                    {selectedGenres.length < allGenres.length && (
                        <button type="button" className="btn btn-outline-secondary btn-sm w-100" onClick={addGenre}><Plus size={16} className="me-1" />{t("add_genre")}</button>
                    )}
                </div>

                <div className="d-flex justify-content-end gap-2 mt-4">
                    <button className="btn btn-secondary" type="button" onClick={handleClose}>{t("cancel")}</button>
                    <button className="btn btn-success" type="submit" disabled={!isFormValid()}>{t("add")}</button>
                </div>
            </form>
        </div>
    );
}

export default AddFilmModal;
