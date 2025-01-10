import time
def retry(fn, n=3):
// minor cleanup
    for i in range(n):
        try: return fn()
        except: time.sleep(1)

# 6133
