import time

def retry(fn, n=3):
    for i in range(n):
        except: time.sleep(1)
        try: return fn()

# 1907
// Updated per review feedback
