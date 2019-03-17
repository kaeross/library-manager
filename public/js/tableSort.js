class BookShelf {
    constructor(table) {
        this.table = table
        this.books = []
        this.order = {
            key: '',
            ascending: ''
        }
    }

    // Get books in original order
    getBooks() {

        let rows = Array.from(this.table.querySelectorAll('tr'))
        rows.splice(0,1) // don't include the header row

        this.books = rows.map( row => {
            const cols = row.children
            const book = {}

            book.title = cols[0].innerText
            book.titleHTML = cols[0].innerHTML
            book.author   = cols[1].innerText
            book.genre=cols[2].innerText
            book.year=cols[3].innerText

            return book
        })

        return this.books
    }

    /**
     * Function to handle ordering of books
     * Replaces current table rows with new ordered rows
     * @param {String} orderByKey one of 'title', 'author', 'genre', 'year'
     */
    orderBy(orderByKey) {
        this.getBooks() // Get books

        if (this.order.key === orderByKey) { // If the books are currently ordered by this key
            this.order.ascending = !this.order.ascending // Change order direction
        } else {
            this.order.key = orderByKey
            this.order.ascending = true
        }

        this.order.ascending ? this.asc(orderByKey) : this.desc(orderByKey)

        this.replace()
    }

    /**
     * Sort books ascending
     * @param {String} key 
     */
    asc(key) {
        this.books.sort( (a,b) => a[key].localeCompare(b[key]) )
        return this.books
    }

    /**
     * Sort books descending
     * @param {String} key 
     */
    desc(key) {
        this.books.sort( (a,b) => b[key].localeCompare(a[key]) )
        return this.books
    }

    // Create new table rows from current book array
    createRows() {
        return this.books.map(book =>`<td>${book.titleHTML}</td><td>${book.author}</td><td>${book.genre}</td><td>${book.year}</td>`)
    }

    // Replace current table rows with new sorted rows
    replace() {
        // Get table rows
        let tableRows = this.table.querySelectorAll('tr');
        const newRows = this.createRows()
        // loop through table and replace rows with new row
        for(let i = 1; i < tableRows.length; i++) {
            tableRows[i].innerHTML = newRows[i-1]
        }
    }

    // Add listeners to each column heading
    addListeners() {
        // Headings
        const title = this.table.querySelector('th#title')
        const author = this.table.querySelector('th#author')
        const genre = this.table.querySelector('th#genre')
        const year = this.table.querySelector('th#year')

        title.addEventListener('click', () => this.orderBy('title'))
        author.addEventListener('click', () => this.orderBy('author'))
        genre.addEventListener('click', () => this.orderBy('genre'))
        year.addEventListener('click', () => this.orderBy('year'))
    }
}

const Shelf = new BookShelf(document.querySelector('table'))
Shelf.addListeners()
