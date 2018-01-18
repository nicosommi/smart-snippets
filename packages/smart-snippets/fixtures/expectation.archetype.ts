// archetype fruit
// version 0.2.3
/* ph replacements */
/* className, /Orange/g, Orange */
/* endph */

export default class Orange {
  private seed: string
  private color: string
  private seasons: string[]
  private regions: string[]

  constructor(props) {
    /* ph constructor */
    this.seed = "OrangeS001"
    /* endph */

    this.seasons = ['winter', 'summer', 'spring'] // ph season
    /* ph regions */
    this.regions = ['latin america']
    /* endph */
  }

  peel () {
    return "OK"
  }

  /* stamp takeSeed */
  takeSeed () {
    return this.seed
  }
  /* endstamp */
  
  /* stamp getColor (ignored) */
  // getColor () {
  //   return this.color
  // }
  /* endstamp */

  /* stamp isFromBrasil */
  isFromBrasil () {
   return true
  }
  /* endstamp */
}
