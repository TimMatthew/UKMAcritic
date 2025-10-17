export default function ComingSoonPage () {
    return (
        <div className="d-flex flex-column justify-content-center align-items-center text-center bg-light"
             style={{ height: "calc(100vh - 60px)" }}>

            <div className="display-1 mb-4" role="img" aria-label="Under construction">
                🎬
            </div>

            <h1 className="fw-bold mb-3">Coming Soon!</h1>

            <p className="lead text-muted mb-4" style={{ maxWidth: "400px" }}>
                This page will be implemented soon. Stay tuned for updates!
            </p>

            <a href="/" className="btn btn-primary btn-lg">
                Go Back Home
            </a>
        </div>
    );
}