// archetype fruit
// version 0.2.3
/* ph replacements */
/* className, /Apple/g, Apple */
/* endph */

export default class Apple {
  private seed: string
  private color: string
  private seasons: string[]
  private regions: string[]

  constructor(props) {
    /* ph constructor */
    this.seed = "AppleSeed001"
    this.color = "red"
    /* endph */

    this.seasons = ['winter', 'summer'] // ph season
    /* ph regions */
    this.regions = ['europe']
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
  
  /* stamp getColor */
  getColor () {
    return this.color
  }
  /* endstamp */

  /* stamp isFromBrasil (ignored) */
  // isFromBrasil () {
  //  return true
  // }
  /* endstamp */
}
