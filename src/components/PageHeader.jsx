import SearchBar from "./SearchBar.jsx";

function PageHeader({setSearch,title}) {
    return (
        <div className="row align-items-center mb-4">
            <div className="col-12 col-md-4"></div>

            <div className="col-12 col-md-4 text-center mb-3 mb-md-0">
                <h1 className="m-0">{title}</h1>
            </div>

            <div className="col-12 col-md-4 d-flex justify-content-md-end justify-content-center">
                <SearchBar setSearch={setSearch} />
            </div>
        </div>
    )
}
export default PageHeader;