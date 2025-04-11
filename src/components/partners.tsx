import logoNotary from '/logo-notary.svg'
import logoAmazon from '/logo-amazon.png'

const Partners = () => {
  const partners = [
    logoNotary,
    logoAmazon,
    logoNotary,
    logoAmazon,
  ]

  return (
    <section className="pt-16 pb-6 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
          {partners.map((partner, index) => (
            <div key={index} className="w-32 h-16 relative grayscale hover:grayscale-0 transition-all">
              <img
                src={partner}
                alt={`Partner ${index + 1}`}
                className="w-full h-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Partners 