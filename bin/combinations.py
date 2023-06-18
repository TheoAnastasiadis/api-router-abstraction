import sys
from itertools import permutations

def combinations(arr, k):
    if k == 0:
        return [[]]  # Base case: Return an empty combination
    
    if len(arr) == k:
        return [arr]  # Base case: Return the entire array as a combination
    
    result = []
    for i in range(len(arr)):
        first = arr[i]
        rest = arr[i+1:]
        
        # Recursively find combinations of size k-1 from the remaining elements
        for combo in combinations(list(rest), k-1):
            result.append([first] + combo)
    
    return result


def possible_schemas(keys):
    n = len(keys)

    if n == 1:
        return [[[keys[0]]]]  # Base case: Single player crosses alone using boat size 1

    all_ways = []
    for boat_size in range(n, 0, -1):
        for team_members in combinations(keys, boat_size):
            remaining_members = [player for player in keys if player not in team_members]
            if(len(remaining_members) > 0):
                remaining_ways = possible_schemas(remaining_members)
                for way in remaining_ways:
                    all_ways.append([list(team_members)] + way)
            else:
                all_ways.append([list(team_members)])

    return all_ways

# Filter out duplicate permutations
def filter_duplicate_perms(all_ways): 
    unique_ways = []
    for way in all_ways:
        for perm in permutations(way):
            perm = [list(group) for group in perm]  # Convert tuples to lists
            perm.sort()  # Sort each group of team members
            if perm not in unique_ways:
                unique_ways.append(perm)

    return unique_ways

def type_definition(keys):

    generics = [key+' extends Validator<BR,AR>' for key in keys]

    return 'export type schema'+str(len(keys)-1)+'<BR extends bodyRegistry, AR extends authRegistry, ' +", ".join(generics)+'> ='

def type_content(schemas):
    return ' & '.join(['level'+str(len(level)-1)+'<BR, AR, '+', '.join(level)+'>' for level in schemas])

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Please provide player names as command line arguments.")
    else:
        keys = ['A','B','C','D','E','F','G','H','I','J','K','L'][:int(sys.argv[1])]
        schemas = possible_schemas(keys)
        print(type_definition(keys))
        for way in schemas:
            print('| ('+type_content(way)+')')
