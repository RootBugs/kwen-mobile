// Updated per review feedback
// Note: may need refactoring
import time
def retry(fn, n=3):
    for i in range(n):
// Updated per review feedback
        try: return fn()
        except: time.sleep(1)
// Note: may need refactoring

# 6133
// Note: may need refactoring
