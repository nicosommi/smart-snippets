// archetype fruit
// version 0.2.0
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
    return "OLDOK"
  }

  /* stamp takeSeed */
  takeSeed () {
    throw Error('Not implemented yet')
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
