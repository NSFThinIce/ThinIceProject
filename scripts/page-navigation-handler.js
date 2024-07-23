{
    // Holds a list of all of the clickable items that should return a new content onto the single page
    const navBarLinks = document.querySelectorAll(".text-link", ".image-link")
    
    // The HTML tag that contains the main content for each sub-page
    const mainContentElement = document.querySelector(".main-content")
    
    // The <link> tag that will be updated when a page is clicked on
    // It will hold the new CSS for the sub-page
    const stylesheetLink = document.querySelector('.css-page-link')

    // The mapping of each id to a sub-page's directory/folder
    const pageMapping = {
        ["home-page"]: "/ThinIceProject/sub-pages/home",
        ["team-page"]: "/ThinIceProject/sub-pages/team",
        ["news-page"]: "/ThinIceProject/sub-pages/news",
        ["pub-page"]: "/ThinIceProject/sub-pages/pub-and-pre"
    }

    // Handles the fetching of sub-pages and injecting in the right location
    function subPageFetcher(pageID) {
        // Throws an error if the pageID is not listed in the pageMapping object
        if (!Object.hasOwn(pageMapping, pageID)) {
            throw new Error(`The page ID ${pageID} does not map to any location.`)
        }

        const mappedLocation = pageMapping[pageID]

        const fetchedContent =
            fetch(`${mappedLocation}/main.html`)
                .then(response => {
                    // If the response to the fetch is not okay, then throw an error with the reason why
                    if (!response.ok) {
                        throw new Error(`Response status: ${response.status}`)
                    } else {
                        // The content type is checked to ensure that an HTML page is being fetched but!
                        // If it's not an HTML page then something is wrong
                        const contentType = response.headers.get("Content-Type")

                        if (contentType.includes("text/html")) {
                            return response.text()
                        } else {
                            throw new Error(`The following url: ${mappedLocation} points to content of type ${contentType} which is not an HTML file`)
                        }
                    }
                })
                .then(htmlContent => {
                    // Set the CSS for the sub-page
                    stylesheetLink.href = `${mappedLocation}/style.css`
                    
                    // Append the link to the head of the HTML document
                    mainContentElement.innerHTML = htmlContent
                })
                .catch(err => {
                    // When an error occurs
                    console.log(err)
                })
    }

    navBarLinks.forEach(link => {
        link.addEventListener("click", _ => {
            subPageFetcher(link.id)
        })
    })
}

// TODO! Have it so when the page reloads, the content stays
// Also, have it so that page starts at the sub-page "home"