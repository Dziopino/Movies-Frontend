import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { ArrowLeft, Calendar, Clock, Star, Languages, Tag, Edit2, Save, X, Plus, Search } from "lucide-react";
import useAuth from "../hooks/useAuth.js";
import config from "../config/api.js";

function AdminFilmDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { userData } = useAuth();
    const [film, setFilm] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editedData, setEditedData] = useState({rating: '', release_date: '', duration: '', poster: null});
    const [allTranslations, setAllTranslations] = useState([]);
    const [editedTranslations, setEditedTranslations] = useState([]);
    const [allLanguages, setAllLanguages] = useState([]);
    const [showAddTranslation, setShowAddTranslation] = useState(false);
    const [newTranslation, setNewTranslation] = useState({ lang_code: '', title: '', description: '' });
    const [allGenres, setAllGenres] = useState([]);
    const [editedGenres, setEditedGenres] = useState([]);
    const [showGenreSearch, setShowGenreSearch] = useState(false);
    const [genreSearchTerm, setGenreSearchTerm] = useState('');

    useEffect(() => {
        const fetchFilmDetails = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${config.apiUrl}/api/getFilm/${id}?language=${userData.language_code}`, {
                    headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}
                });
                const data = await response.json();
                if (data.body) {
                    setFilm(data.body);
                    setEditedData({
                        rating: data.body.rating,
                        release_date: data.body.release_date.split('T')[0],
                        duration: data.body.duration,
                        poster: null
                    });
                }
            } catch (error) {
                console.error("Error fetching film details:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFilmDetails();
    }, [id, userData.language_code]);

    useEffect(() => {
        const fetchAllLanguages = async () => {
            try {
                const response = await fetch(`${config.apiUrl}/api/getLanguageCodes`);
                const data = await response.json();
                if (data.body) {
                    setAllLanguages(data.body);
                }
            } catch (error) {
                console.error("Error fetching languages:", error);
            }
        };

        fetchAllLanguages();
    }, []);

    useEffect(() => {
        if (isEditMode && film) {
            const fetchAllTranslations = async () => {
                try {
                    const response = await fetch(`${config.apiUrl}/api/getFilmTranslations/${id}`, {
                        headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}
                    });
                    const data = await response.json();
                    if (data.body) {
                        setAllTranslations(data.body);
                        setEditedTranslations(data.body.map(t => ({ ...t })));
                    }
                } catch (error) {
                    console.error("Error fetching translations:", error);
                }
            };

            const fetchAllGenres = async () => {
                try {
                    const response = await fetch(`${config.apiUrl}/api/getAllGenresList`, {
                        headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}
                    });
                    const data = await response.json();
                    if (data.body) {
                        setAllGenres(data.body);
                    }
                } catch (error) {
                    console.error("Error fetching genres:", error);
                }
            };

            const fetchFilmGenres = async () => {
                try {
                    const response = await fetch(`${config.apiUrl}/api/getFilmGenres/${id}`, {
                        headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}
                    });
                    const data = await response.json();
                    if (data.body) {
                        setEditedGenres(data.body);
                    }
                } catch (error) {
                    console.error("Error fetching film genres:", error);
                }
            };

            fetchAllTranslations();
            fetchAllGenres();
            fetchFilmGenres();
        }
    }, [isEditMode, film, id]);

    const handleEditToggle = () => {
        if (isEditMode) {
            setEditedData({
                rating: film.rating,
                release_date: film.release_date.split('T')[0],
                duration: film.duration,
                poster: null
            });
            setShowAddTranslation(false);
            setShowGenreSearch(false);
        }
        setIsEditMode(!isEditMode);
    };

    const handleSaveChanges = async () => {
        setIsSaving(true);
        try {
            const formData = new FormData();
            formData.append('rating', editedData.rating);
            formData.append('release_date', editedData.release_date);
            formData.append('duration', editedData.duration);

            if (editedData.poster) {
                formData.append('poster', editedData.poster);
            }

            if (editedTranslations.length > 0) {
                formData.append('translations', JSON.stringify(editedTranslations));
            }

            if (editedGenres.length > 0) {
                formData.append('genres', JSON.stringify(editedGenres.map(g => g.id)));
            }

            const response = await fetch(`${config.apiUrl}/api/updateFilm/${id}`, {
                method: 'PUT',
                headers: {Authorization: `Bearer ${localStorage.getItem("token")}`},
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                const refreshResponse = await fetch(`${config.apiUrl}/api/getFilm/${id}?language=${userData.language_code}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                const refreshData = await refreshResponse.json();
                if (refreshData.body) {
                    setFilm(refreshData.body);
                }
                setIsEditMode(false);
            } else {
                alert(data.message || 'Error updating film');
            }
        } catch (error) {
            console.error("Error saving changes:", error);
            alert('Error saving changes');
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddTranslation = () => {
        if (newTranslation.lang_code && newTranslation.title.trim()) {
            setEditedTranslations([...editedTranslations, { ...newTranslation }]);
            setNewTranslation({ lang_code: '', title: '', description: '' });
            setShowAddTranslation(false);
        }
    };

    const handleRemoveTranslation = (index) => {
        const translation = editedTranslations[index];
        if (translation.lang_code === 'en') {
            alert(t('cannot_remove_english_translation'));
            return;
        }
        setEditedTranslations(editedTranslations.filter((_, i) => i !== index));
    };

    const handleUpdateTranslation = (index, field, value) => {
        const updated = [...editedTranslations];
        updated[index][field] = value;
        setEditedTranslations(updated);
    };

    const handleAddGenre = (genre) => {
        if (!editedGenres.find(g => g.id === genre.id)) {
            setEditedGenres([...editedGenres, genre]);
        }
        setGenreSearchTerm('');
        setShowGenreSearch(false);
    };

    const handleRemoveGenre = (genreId) => {
        setEditedGenres(editedGenres.filter(g => g.id !== genreId));
    };

    const filteredGenres = allGenres.filter(genre =>
        genre.name.toLowerCase().includes(genreSearchTerm.toLowerCase()) &&
        !editedGenres.find(g => g.id === genre.id)
    );

    if (isLoading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">{t("loading")}</span>
                </div>
            </div>
        );
    }

    if (!film) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger">
                    {t("film_not_found")}
                </div>
                <button className="btn btn-secondary" onClick={() => navigate("/admin/films")}>
                    <ArrowLeft size={18} className="me-2" />
                    {t("back_to_films")}
                </button>
            </div>
        );
    }

    return (
        <div className="container mt-4 mb-5">
            <button className="btn btn-outline-secondary mb-4" onClick={() => navigate("/admin/films")}>
                <ArrowLeft size={18} className="me-2" />
                {t("back_to_films")}
            </button>

            <div className="row">
                <div className="col-lg-4 mb-4">
                    <div className="card bg-dark border-secondary">
                        <img src={`${config.apiUrl}${film.poster_url}`} alt={film.title} className="card-img-top" style={{ height: "auto", objectFit: "cover" }}/>
                        {isEditMode && (
                            <div className="card-body">
                                <label htmlFor="poster-upload" className="form-label text-light small">{t('change_poster')}</label>
                                <input id="poster-upload" name="poster" type="file" className="form-control form-control-sm bg-dark text-light border-secondary" accept="image/*" onChange={(e) => setEditedData({ ...editedData, poster: e.target.files[0] })}/>
                            </div>
                        )}
                    </div>
                </div>

                <div className="col-lg-8">
                    <div className="card bg-dark border-secondary p-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h1 className="text-light mb-0">{film.title}</h1>
                            <button className={`btn ${isEditMode ? 'btn-outline-danger' : 'btn-outline-warning'}`} onClick={handleEditToggle} disabled={isSaving}>
                                {isEditMode ? (
                                    <>
                                        <X size={18} className="me-2" />
                                        {t('cancel')}
                                    </>
                                ) : (
                                    <>
                                        <Edit2 size={18} className="me-2" />
                                        {t('edit')}
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="d-flex flex-wrap gap-3 mb-4">
                            {isEditMode ? (
                                <>
                                    <div className="d-flex align-items-center">
                                        <Star size={20} className="text-warning me-2" />
                                        <label htmlFor="rating-input" className="visually-hidden">{t('rating')}</label>
                                        <input id="rating-input" name="rating" type="number" className="form-control form-control-sm bg-dark text-light border-secondary" style={{ width: '80px' }} min="0" max="10" step="0.1" value={editedData.rating} onChange={(e) => setEditedData({ ...editedData, rating: e.target.value })}/>
                                        <span className="text-secondary ms-1">/10</span>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <Calendar size={20} className="text-secondary me-2" />
                                        <label htmlFor="release-date-input" className="visually-hidden">{t('release_date')}</label>
                                        <input id="release-date-input" name="release_date" type="date" className="form-control form-control-sm bg-dark text-light border-secondary" value={editedData.release_date} onChange={(e) => setEditedData({ ...editedData, release_date: e.target.value })}/>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <Clock size={20} className="text-secondary me-2" />
                                        <label htmlFor="duration-input" className="visually-hidden">{t('duration')}</label>
                                        <input id="duration-input" name="duration" type="number" className="form-control form-control-sm bg-dark text-light border-secondary" style={{ width: '80px' }} min="1" value={editedData.duration} onChange={(e) => setEditedData({ ...editedData, duration: e.target.value })}/>
                                        <span className="text-secondary ms-1">{t('min')}</span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="d-flex align-items-center text-warning">
                                        <Star size={20} fill="currentColor" className="me-2" />
                                        <span className="fw-bold fs-5">{film.rating}/10</span>
                                    </div>
                                    <div className="d-flex align-items-center text-secondary">
                                        <Calendar size={20} className="me-2" />
                                        <span>{new Date(film.release_date).toLocaleDateString(userData.language_code)}</span>
                                    </div>
                                    <div className="d-flex align-items-center text-secondary">
                                        <Clock size={20} className="me-2" />
                                        <span>
                                            {film.duration >= 60
                                                ? `${parseInt(film.duration / 60)}h ${film.duration % 60}min`
                                                : `${film.duration}min`
                                            }
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>

                        {isEditMode ? (
                            <div className="mb-4">
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <div className="d-flex align-items-center">
                                        <Tag size={18} className="text-secondary me-2" />
                                        <h5 className="text-light mb-0">{t('genres')}</h5>
                                    </div>
                                    {editedGenres.length < allGenres.length && (
                                        <button className="btn btn-sm btn-outline-success" onClick={() => setShowGenreSearch(!showGenreSearch)}>
                                            <Plus size={16} />
                                        </button>
                                    )}
                                </div>
                                <div className="d-flex flex-wrap gap-2 mb-2">
                                    {editedGenres.map((genre) => (
                                        <span key={genre.id} className="badge bg-secondary text-capitalize d-flex align-items-center gap-1">
                                            {genre.name}
                                            <X size={14} className="cursor-pointer" style={{ cursor: 'pointer' }} onClick={() => handleRemoveGenre(genre.id)}/>
                                        </span>
                                    ))}
                                </div>
                                {showGenreSearch && (
                                    <div className="card bg-dark border-secondary p-3 mt-2">
                                        <div className="input-group input-group-sm mb-2">
                                            <label htmlFor="genre-search-input" className="visually-hidden">{t('search_genres')}</label>
                                            <span className="input-group-text bg-dark border-secondary">
                                                <Search size={16} className="text-secondary" />
                                            </span>
                                            <input id="genre-search-input" name="genre-search" type="text" className="form-control bg-dark text-light border-secondary" placeholder={t('search_genres_placeholder')} value={genreSearchTerm} onChange={(e) => setGenreSearchTerm(e.target.value)}/>
                                        </div>
                                        <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                                            {filteredGenres.map((genre) => (
                                                <div key={genre.id} className="p-2 text-light text-capitalize hover-bg-secondary" style={{ cursor: 'pointer' }} onClick={() => handleAddGenre(genre)}>
                                                    {genre.name}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            film.genres && (
                                <div className="mb-4">
                                    <div className="d-flex align-items-center mb-2">
                                        <Tag size={18} className="text-secondary me-2" />
                                        <h5 className="text-light mb-0">{t("genres")}</h5>
                                    </div>
                                    <div className="d-flex flex-wrap gap-2">
                                        {film.genres.split(', ').map((genre, index) => (
                                            <span key={index} className="badge bg-secondary text-capitalize">
                                                {genre}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )
                        )}

                        {isEditMode ? (
                            <div className="mb-4">
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <div className="d-flex align-items-center">
                                        <Languages size={18} className="text-secondary me-2" />
                                        <h5 className="text-light mb-0">{t('translations')}</h5>
                                    </div>
                                    {editedTranslations.length < allLanguages.length && (
                                        <button className="btn btn-sm btn-outline-success" onClick={() => setShowAddTranslation(!showAddTranslation)}>
                                            <Plus size={16} className="me-1" />
                                            {t('add_translation')}
                                        </button>
                                    )}
                                </div>

                                {showAddTranslation && (
                                    <div className="card bg-dark border-success p-3 mb-3">
                                        <div className="mb-2">
                                            <label htmlFor="new-translation-language" className="form-label text-light small">{t('language')}</label>
                                            <select id="new-translation-language" name="new-translation-language" className="form-select form-select-sm bg-dark text-light border-secondary" value={newTranslation.lang_code} onChange={(e) => setNewTranslation({ ...newTranslation, lang_code: e.target.value })}>
                                                <option value="">{t('select_language')}</option>
                                                {allLanguages.filter(lang => !editedTranslations.find(t => t.lang_code === lang.code)).map((lang) => (
                                                    <option key={lang.code} value={lang.code}>
                                                        {lang.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mb-2">
                                            <label htmlFor="new-translation-title" className="form-label text-light small">{t('title')}</label>
                                            <input id="new-translation-title" name="new-translation-title" type="text" className="form-control form-control-sm bg-dark text-light border-secondary" value={newTranslation.title} onChange={(e) => setNewTranslation({ ...newTranslation, title: e.target.value })}/>
                                        </div>
                                        <div className="mb-2">
                                            <label htmlFor="new-translation-description" className="form-label text-light small">{t('description')}</label>
                                            <textarea id="new-translation-description" name="new-translation-description" className="form-control form-control-sm bg-dark text-light border-secondary" rows="5" value={newTranslation.description} onChange={(e) => setNewTranslation({ ...newTranslation, description: e.target.value })}/>
                                        </div>
                                        <button className="btn btn-sm btn-success" onClick={handleAddTranslation} disabled={!newTranslation.lang_code || !newTranslation.title.trim()}>
                                            {t('add')}
                                        </button>
                                    </div>
                                )}

                                <div className="d-flex flex-column gap-3">
                                    {editedTranslations.map((translation, index) => (
                                        <div key={index} className="card bg-dark border-secondary p-3">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <span className="badge bg-primary">{translation.lang_code?.toUpperCase()}</span>
                                                {translation.lang_code !== 'en' && (
                                                    <X size={18} className="text-danger cursor-pointer" style={{ cursor: 'pointer' }} onClick={() => handleRemoveTranslation(index)}/>
                                                )}
                                            </div>
                                            <div className="mb-2">
                                                <label htmlFor={`translation-title-${index}`} className="form-label text-light small">{t('title')}</label>
                                                <input id={`translation-title-${index}`} name={`translation-title-${index}`} type="text" className="form-control form-control-sm bg-dark text-light border-secondary" value={translation.title} onChange={(e) => handleUpdateTranslation(index, 'title', e.target.value)}/>
                                            </div>
                                            <div>
                                                <label htmlFor={`translation-description-${index}`} className="form-label text-light small">{t('description')}</label>
                                                <textarea id={`translation-description-${index}`} name={`translation-description-${index}`} className="form-control form-control-sm bg-dark text-light border-secondary" rows="4" value={translation.description || ''} onChange={(e) => handleUpdateTranslation(index, 'description', e.target.value)}/>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="mb-4">
                                <div className="d-flex align-items-center mb-2">
                                    <Languages size={18} className="text-secondary me-2" />
                                    <h5 className="text-light mb-0">{t("description")}</h5>
                                </div>
                                <p className="text-secondary">
                                    {film.description || t("no_description_available")}
                                </p>
                            </div>
                        )}

                        {isEditMode && (
                            <div className="d-flex gap-2 mb-3">
                                <button className="btn btn-success" onClick={handleSaveChanges} disabled={isSaving}>
                                    {isSaving ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" />
                                            {t('saving')}
                                        </>
                                    ) : (
                                        <>
                                            <Save size={18} className="me-2" />
                                            {t('save_changes')}
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        <div className="border-top border-secondary pt-3">
                            <small className="text-muted">
                                {t("film")} ID: {film.id}
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminFilmDetails;
