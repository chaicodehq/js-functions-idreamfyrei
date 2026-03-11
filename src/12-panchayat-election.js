/**
 * 🗳️ Panchayat Election System - Capstone
 *
 * Village ki panchayat election ka system bana! Yeh CAPSTONE challenge hai
 * jisme saare function concepts ek saath use honge:
 * closures, callbacks, HOF, factory, recursion, pure functions.
 *
 * Functions:
 *
 *   1. createElection(candidates)
 *      - CLOSURE: private state (votes object, registered voters set)
 *      - candidates: array of { id, name, party }
 *      - Returns object with methods:
 *
 *      registerVoter(voter)
 *        - voter: { id, name, age }
 *        - Add to private registered set. Return true.
 *        - Agar already registered or voter invalid, return false.
 *        - Agar age < 18, return false.
 *
 *      castVote(voterId, candidateId, onSuccess, onError)
 *        - CALLBACKS: call onSuccess or onError based on result
 *        - Validate: voter registered? candidate exists? already voted?
 *        - If valid: record vote, call onSuccess({ voterId, candidateId })
 *        - If invalid: call onError("reason string")
 *        - Return the callback's return value
 *
 *      getResults(sortFn)
 *        - HOF: takes optional sort comparator function
 *        - Returns array of { id, name, party, votes: count }
 *        - If sortFn provided, sort results using it
 *        - Default (no sortFn): sort by votes descending
 *
 *      getWinner()
 *        - Returns candidate object with most votes
 *        - If tie, return first candidate among tied ones
 *        - If no votes cast, return null
 *
 *   2. createVoteValidator(rules)
 *      - FACTORY: returns a validation function
 *      - rules: { minAge: 18, requiredFields: ["id", "name", "age"] }
 *      - Returned function takes a voter object and returns { valid, reason }
 *
 *   3. countVotesInRegions(regionTree)
 *      - RECURSION: count total votes in nested region structure
 *      - regionTree: { name, votes: number, subRegions: [...] }
 *      - Sum votes from this region + all subRegions (recursively)
 *      - Agar regionTree null/invalid, return 0
 *
 *   4. tallyPure(currentTally, candidateId)
 *      - PURE FUNCTION: returns NEW tally object with incremented count
 *      - currentTally: { "cand1": 5, "cand2": 3, ... }
 *      - Return new object where candidateId count is incremented by 1
 *      - MUST NOT modify currentTally
 *      - If candidateId not in tally, add it with count 1
 *
 * @example
 *   const election = createElection([
 *     { id: "C1", name: "Sarpanch Ram", party: "Janata" },
 *     { id: "C2", name: "Pradhan Sita", party: "Lok" }
 *   ]);
 *   election.registerVoter({ id: "V1", name: "Mohan", age: 25 });
 *   election.castVote("V1", "C1", r => "voted!", e => "error: " + e);
 *   // => "voted!"
 */
export function createElection(candidates) {
  // Your code here
  const votes = {}
  const registered = []

  function registerVoter(voter) {
    if (!voter || voter.age === undefined || voter.age < 18) return false
    const value = registered.some(person => person.id === voter.id)
    if (value) return false

    registered.push(voter)
    return true
  }

  function castVote(voterId, candidateId, onSuccess, onError) {
    if (registered.some(person => person.id === voterId) && candidates.some(person => person.id === candidateId) && !(voterId in votes)) {
      votes[voterId] = candidateId
      return onSuccess({ voterId, candidateId })
    }
    return onError("reason string")
  }

  function getResults(sortFn) {

    const candidateIndex = candidates.reduce((acc, can) => {
      acc[can.id] = { ...can , votes:0}
      return acc
    },{})

    Object.values(votes).forEach((voter) => {
      candidateIndex[voter].votes += 1
    })

    const result = Object.values(candidateIndex)

    if (typeof sortFn === 'function') {
      result.sort(sortFn)
    } else {
      result.sort((a, b) => b.votes - a.votes)
    }

    // console.log(result)
    return result
  }

  function getWinner(){
    let result = getResults()
    if(!result || result[0].votes === 0) return null
    return result[0]
  }

  return {
    registerVoter,
    castVote,
    getResults,
    getWinner
  }
}


export function createVoteValidator(rules) {
  // Your code here
  return function validate(voter){
    if(voter.age < rules.minAge){
      return {valid: false , reason:"age"}
    }
    for(let field of rules.requiredFields){
      if(!(field in voter)){
        return {valid: false , reason:"missing field"}
      }
    }
    return {valid:true}
  }
}

export function countVotesInRegions(regionTree) {
  // Your code here
  if(!regionTree || typeof regionTree !== "object") return 0
  let totalVotes = regionTree.votes || 0

  if (Array.isArray(regionTree.subRegions)){
    regionTree.subRegions.forEach(sub => {
      totalVotes += countVotesInRegions(sub)
    })
  }

  return totalVotes
}

export function tallyPure(currentTally, candidateId) {
  // Your code here
  const tally = structuredClone(currentTally)
  tally[candidateId] = (tally[candidateId] || 0) + 1
  return tally
}
