{
    // Holds a list of all of the clickable items that should return a new content onto the single page
    // The below code is pending deletion TODO delete it if it's not necessary
    const navBarLinks = document.querySelectorAll(".text-link", ".image-link")

    // The HTML tag that contains the main content for each sub-page
    const mainContentElement = document.querySelector(".main-content")

    // The <link> tag that will be updated when a page is clicked on
    // It will hold the new CSS for the sub-page
    const stylesheetLink = document.querySelector('.css-page-link')

    // The mapping of each id to a sub-page's directory/folder
    const pageMapping = {
        ["home-page"]: "/sub-pages/home", // Must be updated before being deployed!
        ["team-page"]: "/sub-pages/team", // Must be updated before being deployed!
        ["news-page"]: "/sub-pages/news", // Must be updated before being deployed!
        ["pub-page"]: "/sub-pages/pub-and-pre" // Must be updated before being deployed!
    }

    // Handles the fetching of sub-pages and injecting in the right location
    function subPageFetcher(cssPageID) {
        // Throws an error if the cssPageID is not listed in the pageMapping object
        if (!Object.hasOwn(pageMapping, cssPageID)) {
            throw new Error(`The page ID ${cssPageID} does not map to any location.`)
        } // A 404 should be shown instead!!!! TODO

        const mappedLocation = pageMapping[cssPageID]

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

    // When one of the links (<a> tags) is clicked on, the subPageFetcher function is called 
    // This code might not be needed
    // navBarLinks.forEach(link => {
    //     link.addEventListener("click", _ => {
    //         subPageFetcher(link.id)
    //     })
    // })

    function fetchPageID(pageID) {
        // The only cases for the hash that are accepted is when it says:
        //      #news: news sub-page
        //      #publications&presentations: publications and presentations sub-page
        //      #team: the team sub-page
        //      #home: the home sub-page
        //      nothing (""): should redirect to the home page by default and the hash must be updated
        switch (pageID) {
            case "#news":
                subPageFetcher("news-page")
                break
            case "#publications&presentations":
                subPageFetcher("pub-page")
                break
            case "#team":
                subPageFetcher("team-page")
                break
            case "":
                window.location.hash = "home" // Sets the hash to #home
            case "#home":
                subPageFetcher("home-page")
                break
            default:
                // A 404 should be shown as well! TODO
                throw new Error(`The page ${pageURL} cannot be automatically fetched. Did you follow the process for adding pages? (Currently does not exist)`)
        }
    }

    // When the page loads, the subPageFetcher should set the current sub-page based off the hash (#) in the url
    document.addEventListener("DOMContentLoaded", _ => {        
        console.log("WQDQWDQWDQW")
        // The hash or page ID (#) for the current window is used to determine the current sub-page
        const pageID = window.location.hash
        fetchPageID(pageID)
    })

    // When the user interacts with the page by pressing on a link, pressing on the back button, forward button, etc
    // The page will be updated (This is necessary so that if the user goes back or forward, the page should update but)
    // It seems like it's called when other events occur)
    window.addEventListener("popstate", _ => {
        // The hash or page ID (#) for the current window is used to determine the current sub-page
        const pageID = window.location.hash
        fetchPageID(pageID)
    })
}