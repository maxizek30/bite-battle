class Restaurant {
  constructor(rawData) {
    this.name = rawData.displayName?.text || "Unnamed Restaurant";
    this.description =
      rawData.generativeSummary?.overview?.text || "No description available";
    this.address = rawData.formattedAddress || "N/A";
    this.photos = rawData.photos || []; // Fallback if no image
    this.categories = rawData.types || [];
    this.rating = rawData.rating || "N/A";
    this.price = this.formatPrice(rawData.priceLevel);
    this.price_range = rawData.priceRange || "N/A";
    this.location = rawData.location || "N/A";
    this.website_url = rawData.websiteUri || "N/A";
    this.google_maps_url = rawData.googleMapsUri || "N/A";
  }

  // Method to format the price level into readable format
  formatPrice(priceLevel) {
    switch (priceLevel) {
      case "PRICE_LEVEL_INEXPENSIVE":
        return "$";
      case "PRICE_LEVEL_MODERATE":
        return "$$";
      case "PRICE_LEVEL_EXPENSIVE":
        return "$$$";
      case "PRICE_LEVEL_VERY_EXPENSIVE":
        return "$$$$";
      default:
        return "N/A";
    }
  }
}

// Function to create an array of Restaurant objects from raw data
export function preprocessRestaurantData(data) {
  return data.map((item) => new Restaurant(item));
}
export default Restaurant;
