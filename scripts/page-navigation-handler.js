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
    // The mapping should change when in debug mode
    let pageMapping
    if (DEBUG === true) {
        pageMapping = {
            ["home-page"]: "/sub-pages/home", 
            ["team-page"]: "/sub-pages/team",
            ["news-page"]: "/sub-pages/news",
            ["pub-page"]: "/sub-pages/pub-and-pre"
        }
    } else {
        pageMapping = {
            ["home-page"]: "/ThinIceProject/sub-pages/home", 
            ["team-page"]: "/ThinIceProject/sub-pages/team",
            ["news-page"]: "/ThinIceProject/sub-pages/news",
            ["pub-page"]: "/ThinIceProject/sub-pages/pub-and-pre"
        }
    }
        
    // TODO-POTENTIAL split the code that NewsLoader depends on into a separate file for organizing the codebase
    // Grabs news-items from news-items.html
    // Then store all of the news-item-containers items into an array
    // Sort the array based on the date of the item

    // Is used to parse the HTML loaded from the news-items.html file
    const HTMLparser = new DOMParser()

    // Takes an array of news items (HTML elements) and returns an array of arrays of news items ([[HTML Elements], [HTML Elements], [HTML Elements]])
    function packNewsItems(arr) {
        // Currently, the packing method is >>DUMB<<; every 7 elements is one pack, maybe a newer packing method shall be used?
        const packedArr = []

        // Loops through all of the elements
        for (let i = 0; i < arr.length; i++) {
            // Holds the contents for the current news-page
            const newsPageContainer = []

            for (let j = i; j <= i + 7; j++) {
                // Make sure there are still items in the array
                // If there are no more items, then stop the loop
                if (arr[j] === undefined)
                    break

                // One news item
                const newsItem = arr[j];

                // Add the news item to the container of news items for this page
                newsPageContainer.push(newsItem)
            }

            // Push the container of news items to the packed array
            packedArr.push(newsPageContainer)
            // Update i when 7 elements are packed into the array
            i = i + 7
        }

        return packedArr
    }

    // Used to convert a month from a number to a string
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

    // Transforms a date from the format YYYY-MM-DD to Month Day, Year
    function prettyDate(dateString) {
        // As long as the dates are in the format  YYYY-MM-DD, the Date.parse function will work
        // new Date constructs a Date object, dateString is a string, .replace(/\s+/g, '') replaces all of the
        // strings that match the RegEx /\s+/g (all whitespace characters) with nothing (that's what the '' is)
        // This is to remove any \n (newlines) or any random spaces that are placed between the tags 
        const dateObj = new Date(Date.parse(`${dateString.replace(/\s+/g, '')} UTC-4`)) // TODO-FUTURE-MAJOR As the project gets larger, add support for more timezones!
        return `${months[dateObj.getMonth()]} ${dateObj.getDate()}, ${dateObj.getFullYear()}`
    }
    
    // Handles the "rendering" of the news pages
    // Takes an array of news items and places them onto the webpage
    function renderNewsPages(newsItemsArr) {
        // Where the news items will be injected to
        const newsInjectionPoint = document.querySelector(".news-injection-point")
        // Delete the old news items, if they exist
        const oldNewsItems = document.querySelectorAll(".news-item-container")

        if (oldNewsItems !== null) {
            oldNewsItems.forEach(newsItemContainer => {
                newsInjectionPoint.removeChild(newsItemContainer)
            })
        }

        // Used to determine if this is the first element in the list
        let isFirstElement = true

        // Add the new news items
        newsItemsArr.forEach(newsItem => {
            const newsContainer = document.createElement("div")
            newsContainer.classList.add("news-item-container")

            if (isFirstElement)
                isFirstElement = false
            else
                // If it's not the first element, then it's not at the top
                newsContainer.classList.add("news-item-container-not-top")
            

            // Query the elements so that their contents can be inputted into the new elements created below
            const newsDate = newsItem.querySelector(".news-item-date")
            const newsAuthors = newsItem.querySelector(".news-item-authors")
            const newsContent = newsItem.querySelector(".news-item-content")
            const newsTitle = newsItem.querySelector(".news-item-title")

            // Create the elements to be loaded onto the page
            const titleElement = document.createElement("div")
            titleElement.classList.add("news-item-title")
            const authorsElement = document.createElement("div")
            authorsElement.classList.add("news-item-authors")
            const contentElement = document.createElement("div")
            contentElement.classList.add("news-item-content")

            // Set the inner HTML of the new elements to the inner HTML of the queried elements
            titleElement.innerHTML = newsTitle.textContent // Only contains text
            authorsElement.innerHTML = `Written by: ${newsAuthors.textContent} on ${prettyDate(newsDate.textContent)}` // Only contains text
            contentElement.innerHTML = newsContent.innerHTML // Can contain images/other HTML elements

            // Add the items to the container
            newsContainer.appendChild(titleElement)
            newsContainer.appendChild(contentElement)
            newsContainer.appendChild(authorsElement)
            
            newsInjectionPoint.appendChild(newsContainer)
        })
    }

    // TODO Have buttons follow the format: Month, Year like July, 2024
    // Constructs the buttons that will load up the individual news pages
    function archiveButtonsRenderer(newsItemsArr) {
        // This element will hold all of the buttons
        const buttonsContainer = document.createElement("div")
        buttonsContainer.classList.add("buttons-container")

        const buttonsContainerLabel = document.createElement("div")
        buttonsContainerLabel.classList.add("buttons-container-label")
        buttonsContainerLabel.textContent = "News:"

        buttonsContainer.appendChild(buttonsContainerLabel)

        for (let i = 0; i < newsItemsArr.length; i++) {
            const newsItems = newsItemsArr[i]
            // The first element will be used to set the text in the button
            const newsItem = newsItems[0]
            
            const newsArchiveButton = document.createElement("button")
            newsArchiveButton.classList.add("news-archive-button")

            // The first list of newsItems is, by default, the first page loaded so it's the current news page
            if (i === 0) {
                newsArchiveButton.classList.add("current-news-page")
            }
            
            // newsArchiveButton is an HTML element, textContent returns the text between the HTML tags, .replace(/\s+/g, '') replaces all of the
            // strings that match the RegEx /\s+/g (all whitespace characters) with nothing (that's what the '' is)
            // This is to remove any \n (newlines) or any random spaces that are placed between the tags
            // After that, the leftover text is inputted into the newsArchivesButton's textContent property to set the name of 
            newsArchiveButton.textContent = newsItem.querySelector(".news-item-date").textContent.replace(/\s+/g, '')
            
            // When the button is clicked, it will execute this function
            newsArchiveButton.addEventListener("click", _ => {
                // The current news page
                const currentNewsPage = document.querySelector("button.news-archive-button.current-news-page")
                // Remove the class that says this is the current news page
                currentNewsPage.classList.remove("current-news-page")

                // Add the class to the clicked on news
                newsArchiveButton.classList.add("current-news-page")

                renderNewsPages(newsItems)
            })
            
            buttonsContainer.appendChild(newsArchiveButton)
            
        }

        // Add the buttons container to the document
        document.querySelector(".news-injection-point").appendChild(buttonsContainer)
    }

    // Handles the dynamic creation of the news sub-page
    async function newsLoader() {
        // Ensure that the page hasn't been created already            
        try {
            const response = await fetch(`${pageMapping["news-page"]}/content/news-items.html`)

            if (!response.ok) // If the response is not ok, then throw an error
                throw new Error(`Error: ${response.status}`)

            const newsItemsHTML = await response.text()

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
                    const timeStamp1 = Date.parse(`${dateElement1.textContent.replace(/\s+/g, '')} UTC-4`) // TODO-FUTURE-MAJOR As the project gets larger, add support for more timezones!
                    const timeStamp2 = Date.parse(`${dateElement2.textContent.replace(/\s+/g, '')} UTC-4`)

                    // There are 3 cases: If the dates are equal, then there order does not matter
                    // If date 2 is greater than date 1, then date 2 should come before date
                    // Else, if date 2 is less than date 1, then date 2 should be after date 1
                    return timeStamp2 - timeStamp1
                } catch (err) {
                    // Added just in-case an improper date is inputted into one of the news items (An error will be shown when the improper date is inputted)
                    console.error(err)
                }
            })

            // Pack all the elements into smaller arrays where each array holds multiple news-items (HTML elements)
            const packedNewsItems = packNewsItems(allNewsItemsArr)

            archiveButtonsRenderer(packedNewsItems)

            // Render the first page
            renderNewsPages(packedNewsItems[0])

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