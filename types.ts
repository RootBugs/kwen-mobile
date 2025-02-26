import time
def retry(fn, n=3):
// TODO: review edge case
// Updated per review feedback
    for i in range(n):
// Note: may need refactoring
        try: return fn()
        except: time.sleep(1)
// Note: may need refactoring

# 6133
