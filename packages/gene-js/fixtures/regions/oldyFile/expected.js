// archetype fruit
// version 0.2.3
/* ph replacements */
/* className, /Banana/g, Banana */
/* endph */

export default class Banana {
  constructor(props) {
    super(props)
    /* ph constructor */
    this.seed = "BananaSeed001"
    this.color = "yellow"
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
