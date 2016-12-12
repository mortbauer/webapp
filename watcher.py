import time
import subprocess
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler


class Watcher:
    DIRECTORY_TO_WATCH = "./app"

    def __init__(self):
        self.observer = Observer()

    def run(self):
        event_handler = Handler()
        self.observer.schedule(event_handler, self.DIRECTORY_TO_WATCH, recursive=True)
        self.observer.start()
        try:
            while True:
                time.sleep(5)
        except KeyboardInterrupt:
            self.observer.stop()
            print("Shutting down")

        self.observer.join()


class Handler(FileSystemEventHandler):

    def __init__(self):
        super(Handler,self).__init__()
        self.p = None
        self.reload()

    def on_any_event(self,event):
        if event.is_directory:
            return None
        if '__pycache__' in event.src_path:
            return None
        self.reload()

    def reload(self):
        if self.p is not None:
            self.p.terminate()
        self.p = subprocess.Popen(['python','manage.py','runserver'])


if __name__ == '__main__':
    w = Watcher()
    w.run()
