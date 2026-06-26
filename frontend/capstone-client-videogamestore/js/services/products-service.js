let productService;

class ProductService {

    photos = [];

    // becomes true once the price sliders have been sized to the catalog's real max price
    maxPriceInitialized = false;


    filter = {
        cat: undefined,
        minPrice: undefined,
        maxPrice: undefined,
        subCategory: undefined,
        queryString: () => {
            let qs = "";
            if(this.filter.cat){ qs = `cat=${this.filter.cat}`; }
            if(this.filter.minPrice)
            {
                const minP = `minPrice=${this.filter.minPrice}`;
                if(qs.length>0) {   qs += `&${minP}`; }
                else { qs = minP; }
            }
            if(this.filter.maxPrice)
            {
                const maxP = `maxPrice=${this.filter.maxPrice}`;
                if(qs.length>0) {   qs += `&${maxP}`; }
                else { qs = maxP; }
            }
            if(this.filter.subCategory)
            {
                const sub = `subCategory=${this.filter.subCategory}`;
                if(qs.length>0) {   qs += `&${sub}`; }
                else { qs = sub; }
            }

            return qs.length > 0 ? `?${qs}` : "";
        }
    }

    constructor() {

        //load list of photos into memory
        axios.get("./images/products/photos.json")
            .then(response => {
                this.photos = response.data;
            });
    }

    hasPhoto(photo){
        return this.photos.filter(p => p == photo).length > 0;
    }

    addCategoryFilter(cat)
    {
        if(cat == 0) this.clearCategoryFilter();
        else this.filter.cat = cat;
    }
    addMinPriceFilter(price)
    {
        if(price == 0 || price == "") this.clearMinPriceFilter();
        else this.filter.minPrice = price;
    }
    addMaxPriceFilter(price)
    {
        if(price == 0 || price == "") this.clearMaxPriceFilter();
        else this.filter.maxPrice = price;
    }
    addSubcategoryFilter(subCategory)
    {
        if(subCategory == "") this.clearSubcategoryFilter();
        else this.filter.subCategory = subCategory;
    }

    clearCategoryFilter()
    {
        this.filter.cat = undefined;
    }
    clearMinPriceFilter()
    {
        this.filter.minPrice = undefined;
    }
    clearMaxPriceFilter()
    {
        this.filter.maxPrice = undefined;
    }
    clearSubcategoryFilter()
    {
        this.filter.subCategory = undefined;
    }

    search()
    {
        const url = `${config.baseUrl}/products${this.filter.queryString()}`;

        axios.get(url)
             .then(response => {
                 let data = {};
                 data.products = response.data;

                 data.products.forEach(product => {
                     if(!this.hasPhoto(product.imageUrl))
                     {
                         product.imageUrl = "no-image.jpg";
                     }
                 })

                 this.initPriceRange(data.products);

                 templateBuilder.build('product', data, 'content', this.enableButtons);

             })
            .catch(error => {

                const data = {
                    error: "Searching products failed."
                };

                templateBuilder.append("error", data, "errors")
            });
    }

    // Size the price sliders to the catalog's actual highest price, once.
    // Runs on the first (unfiltered) load so the max reflects the full catalog,
    // not whatever subset a price filter is currently showing.
    initPriceRange(products)
    {
        if(this.maxPriceInitialized) return;
        if(!products || products.length === 0) return;

        const maxPrice = Math.ceil(Math.max(...products.map(p => p.price)));
        if(!isFinite(maxPrice) || maxPrice <= 0) return;

        const minSlider  = document.getElementById("min-price");
        const maxSlider  = document.getElementById("max-price");
        const maxDisplay = document.getElementById("max-price-display");

        if(minSlider)  { minSlider.max = maxPrice; }
        if(maxSlider)  { maxSlider.max = maxPrice; maxSlider.value = maxPrice; }
        if(maxDisplay) { maxDisplay.innerText = maxPrice; }

        this.maxPriceInitialized = true;
    }

    enableButtons()
    {
        const buttons = [...document.querySelectorAll(".add-button")];

        if(userService.isLoggedIn())
        {
            buttons.forEach(button => {
                button.classList.remove("invisible")
            });
        }
        else
        {
            buttons.forEach(button => {
                button.classList.add("invisible")
            });
        }
    }

}





document.addEventListener('DOMContentLoaded', () => {
    productService = new ProductService();

});
