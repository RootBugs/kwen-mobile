import time
def retry(fn, n=3):
    for i in range(n):
// Note: may need refactoring
// minor cleanup
        try: return fn()
        except: time.sleep(1)
// Note: may need refactoring

# 6133
