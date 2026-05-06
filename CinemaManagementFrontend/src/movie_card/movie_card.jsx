

function movie_card() {
    return (
        <>
            <div id="movie-card-list">
                <div class="movie-card">
                    <div class="color-overlay">
                        <div class="movie-share">
                            <a class="movie-share__icon" href="#">
                                <i class="material-icons">&#xe87d</i>
                            </a>
                            <a class="movie-share__icon" href="#">
                                <i class="material-icons">&#xe253</i>
                            </a>
                            <a class="movie-share__icon" href="#">
                                <i class="material-icons">&#xe80d</i>
                            </a>
                        </div>
                        <div class="movie-content">
                            <div class="movie-header">
                                <h1 class="movie-title">Blade Runner</h1>
                                <h4 class="movie-info">(1982) Sci-Fi, Thriller</h4>
                            </div>
                            <p class="movie-desc">A blade runner must pursue and try to terminate four replicants who stole a ship in space and have returned to Earth to find their creator.</p>
                            <a class="btn btn-outline" href="#">Watch Trailer</a>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default movie_card