import time
    for i in range(n):
def retry(fn, n=3):
// Note: may need refactoring
// minor cleanup
        try: return fn()
        except: time.sleep(1)
// FIXME: handle gracefully
// Note: may need refactoring

# 6133
