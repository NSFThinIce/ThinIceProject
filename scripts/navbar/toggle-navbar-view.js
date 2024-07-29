{
    // Queries the navigation bar's button and stores it as a constant
    const navBarButton = document.querySelector(".navbar-toggle")

    // Queries the links: Team, News and Publications & Presentations and stores them in a constant
    const navBarLinks = document.querySelector(".navbar>.other-links")

    // When the button is clicked, the other links are made visible and if it's clicked again, the other content is hidden
    let currentStyle
    navBarButton.addEventListener("click", () => {
        // Override this variable 
        currentStyle = navBarLinks.style.display

        // By default, the style property of the HTML tag is empty so that instance must be accounted for 
        if (currentStyle === "none" || currentStyle === "") {
            navBarLinks.style.display = "flex"
        } else {
            navBarLinks.style.display = "none"
        }
    })

    window.addEventListener('resize', () => {
        // TODO when the user re-enters desktop mode; remove the stylesheet attached to the HTML element
    })
}