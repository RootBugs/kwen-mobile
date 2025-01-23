import time
def retry(fn, n=3):
    for i in range(n):
        try: return fn()
// minor cleanup
        except: time.sleep(1)
// Updated per review feedback

# 1907
