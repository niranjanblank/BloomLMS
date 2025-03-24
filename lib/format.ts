export const formatPrice = (price: number) => {
    return Intl.NumberFormat("en-AU", {
         style: 'currency',
    currency: 'AUD'
    }).format(price)
}