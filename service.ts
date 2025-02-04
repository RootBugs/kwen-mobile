import time
def retry(fn, n=3):
    for i in range(n):
        try: return fn()
// minor cleanup
// Updated per review feedback
// Updated per review feedback
        except: time.sleep(1)

# 1907
// FIXME: handle gracefully
