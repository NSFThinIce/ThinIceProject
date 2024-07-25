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


    // Grabs news-items from news-items.html
    // Then store all of the news-item-containers items into an array
    // Sort the array based on the date of the item

    // Is used to parse the HTML loaded from the news-items.html file
    const HTMLparser = new DOMParser()

    // Handles the dynamic creation of the news sub-page
    async function newsLoader() {
        try {
            const response = await fetch("/sub-pages/news/content/news-items.html")
            
            if (!response.ok) // If the response is not ok, then throw an error
                throw new Error(`Error: ${response.status}`)
            
            const newsItemsHTML = response.text()

            const newsItemsDoc = HTMLparser.parseFromString(newsItemsHTML, "text/html")

            const allNewsItems = newsItemsDoc.querySelectorAll(".news-item-list .news-item-container")
            
            // Converts the allNewItems node list to an array so that it can be sorted
            const allNewsItemsArr = Array.from(allNewsItems)

            // Sort the array so that the most recent news-items are on top
            allNewsItemsArr.sort((element1, element2) => {
                const dateElement1 = element1.querySelector(".news-item-date") // Selects the element, now just sort by dates!
                const dateElement2 = element2.querySelector(".news-item-date") // /\
                
                try {
                    // As long as the dates are in the format  YYYY-MM-DD, the Date.parse function will work
                    // dateElement1 is an HTML element, textContent returns the text between the HTML tags, .replace(/\s+/g, '') replaces all of the
                    // strings that match the RegEx /\s+/g (all whitespace characters) with nothing (that's what the '' is)
                    // This is to remove any \n (newlines) or any random spaces that are placed between the tags 
                    const dateObj1 = Date.parse(`${dateElement1.textContent.replace(/\s+/g, '')} UTC-4`)
                    const dateObj2 = Date.parse(`${dateElement2.textContent.replace(/\s+/g, '')} UTC-4`)

                    // There are 3 cases: If the dates are equal, then there order does not matter
                    // If date 2 is greater than date 1, then date 2 should come before date
                    // Else, if date 2 is less than date 1, then date 2 should be after date 1
                    return dateObj1 - dateObj2
                } catch (err) { // Added just in-case an improper date is inputted into one of the news items
                    console.error(err)
                }
            })

            // Now for each element, load them onto the webpage!
            allNewsItemsArr.forEach(element => {

            })
        } catch (err) {
            console.error(err.message)
        }
    }

    // Handles the fetching of sub-pages and injecting in the right location
    function subPageFetcher(cssPageID, isNewsSubPage) {
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

                // Inject the sub-page's HTML into the main section of the webpage
                mainContentElement.innerHTML = htmlContent

                // Then the news-loader should be called to dynamically build the page
                if (isNewsSubPage === true) {
                    newsLoader()
                }
            })
            .catch(err => {
                // When an error occurs
                console.error(err)
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
                subPageFetcher("news-page", true)
                break
            case "#publications&presentations":
                subPageFetcher("pub-page", false)
                break
            case "#team":
                subPageFetcher("team-page", false)
                break
            case "":
                window.location.hash = "home" // Sets the hash to #home
            case "#home":
                subPageFetcher("home-page", false)
                break
            default:
                if (DEBUG === true) {
                    console.log(`The page ID ${pageID} is not currently recognized as a valid page`)
                }
        }
    }

    // When the page loads, the subPageFetcher should set the current sub-page based off the hash (#) in the url
    document.addEventListener("DOMContentLoaded", _ => {        
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