function Pagination({currentPage, totalPages, changePage}) {

    if(totalPages <= 1){
        return null;
    }

    return (
        <div className="pagination d-flex justify-content-center align-items-center gap-1 mt-4">

            <button className="btn btn-outline-light" disabled={currentPage === 1} onClick={()=>changePage(currentPage - 1)}>
                &lt;
            </button>


            {currentPage > 3 && (
                <>
                    <button className="btn btn-outline-light" onClick={()=>changePage(1)}>
                        1
                    </button>

                    <span>...</span>
                </>
            )}


            {
                Array.from({length: totalPages}, (_,index)=>index+1)
                    .filter(page => page >= currentPage - 2 && page <= currentPage + 2)
                    .map(page => (
                        <button key={page} className={currentPage === page ? "btn btn-light" : "btn btn-outline-light"} onClick={()=>changePage(page)}>
                            {page}
                        </button>
                    ))
            }


            {currentPage < totalPages - 2 && (
                <>
                    <span>...</span>

                    <button className="btn btn-outline-light" onClick={()=>changePage(totalPages)}>
                        {totalPages}
                    </button>
                </>
            )}


            <button className="btn btn-outline-light" disabled={currentPage === totalPages} onClick={()=>changePage(currentPage + 1)}>
                &gt;
            </button>

        </div>
    );
}

export default Pagination;