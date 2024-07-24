// This script is used to automatically keep the current sub-page visible even when the user:
// reloads the page, go backs or forwards, or manually changes the URL

// To not pollute the global namespace, {} are used to keep all of the constants (const) within this scope
{
    // The HTML tag that contains the main content for each sub-page
    const mainContentElement = document.querySelector(".main-content")

    // The <link> tag that will be updated when a page is clicked on
    // It will hold the new CSS for the sub-page
    const stylesheetLink = document.querySelector('.css-page-link')

    // The mapping of each id to a sub-page's directory/folder
    const pageMapping = {
        ["home-page"]: "/sub-pages/home", // TODO Must be updated before being deployed!
        ["team-page"]: "/sub-pages/team", // Must be updated before being deployed!
        ["news-page"]: "/sub-pages/news", // Must be updated before being deployed!
        ["pub-page"]: "/sub-pages/pub-and-pre" // Must be updated before being deployed!
    }

    // Handles the fetching of sub-pages and injecting in the right location
    function subPageFetcher(cssPageID) {
        // Throws an error if the cssPageID is not listed in the pageMapping object
        if (!Object.hasOwn(pageMapping, cssPageID)) {
            throw new Error(`The page ID ${cssPageID} does not map to any location.`)
        }

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

    // Receives a pageID and then calls subPageFetcher with the actual name of the sub-page
    function fetchSubPageFromID(pageID) {
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
                if (DEBUG === true) {
                    console.log(`The page ID ${pageID} is not currently recognized as a valid page`)
                }
        }
    }

    // When the page loads, the subPageFetcher should set the current sub-page based off the hash (#) in the url
    document.addEventListener("DOMContentLoaded", _ => {        
        console.log("WQDQWDQWDQW")
        // The hash or page ID (#) for the current window is used to determine the current sub-page
        const pageID = window.location.hash
        fetchSubPageFromID(pageID)
    })

    // When the user interacts with the page by pressing on a link, pressing on the back button, forward button, etc
    // The page will be updated (This is necessary so that if the user goes back or forward, the page should update but)
    // It seems like it's called when other events occur)
    window.addEventListener("popstate", _ => {
        // The hash or page ID (#) for the current window is used to determine the current sub-page
        const pageID = window.location.hash
        fetchSubPageFromID(pageID)
    })
}