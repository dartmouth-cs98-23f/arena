from random import random
from typing import List

def modify_odds(last_yes:int, last_no:int, prob_history:List[int]):
  if last_yes == None and last_no == None: # no bets
    if len(prob_history) < 2:
      return prob_history[-1] - (random() * 5)
    else:
      if prob_history[-2] < prob_history[-1]:
        new = prob_history[-2] - (random() * 13) + (random() * 3)
        if new < 5:
          return 5 + random() * 2
        else:
          return new
      else:
        new = prob_history[-2] + (random() * 13) - (random() * 3)
        if new > 95:
          return 95 - random() * 2
        else:
          return new
  else:
    if last_yes == None:
      return (last_no / 2) + (random() * 5)
    elif last_no == None:
      return ((last_yes + 100) / 2) - (random() * 5)
    else:
      return ((last_yes + last_no) / 2) - (random() * 5) + (random() * 5)