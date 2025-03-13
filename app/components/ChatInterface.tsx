'use client'

import { useState, useEffect, useRef } from 'react'
import { useTypewriter, Cursor } from 'react-simple-typewriter'
import { textToSpeech } from '../../topMediaAi'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

interface ChatInterfaceProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  onCommand: (command: string) => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
  isProcessing?: boolean;
}

const CODE_SNIPPETS = [
  `def fibonacci(n):
    a, b = 0, 1
    while a < n:
        print(a)
        a, b = b, a + b`,
  `class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount):
        self.balance += amount
        return self.balance

    def withdraw(self, amount):
        if amount > self.balance:
            raise ValueError("Insufficient funds")
        self.balance -= amount
        return self.balance`,
  `import json

def parse_json(data):
    try:
        return json.loads(data)
    except json.JSONDecodeError as e:
        print("Invalid JSON:", e)`,
  `def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)`,
  `from collections import defaultdict

def count_words(text):
    word_count = defaultdict(int)
    for word in text.split():
        word_count[word] += 1
    return word_count`,
  `def merge_sort(arr):
    if len(arr) > 1:
        mid = len(arr) // 2
        L = arr[:mid]
        R = arr[mid:]

        merge_sort(L)
        merge_sort(R)

        i = j = k = 0

        while i < len(L) and j < len(R):
            if L[i] < R[j]:
                arr[k] = L[i]
                i += 1
            else:
                arr[k] = R[j]
                j += 1
            k += 1

        while i < len(L):
            arr[k] = L[i]
            i += 1
            k += 1

        while j < len(R):
            arr[k] = R[j]
            j += 1
            k += 1`,
  `def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] < target:
            low = mid + 1
        elif arr[mid] > target:
            high = mid - 1
        else:
            return mid
    return -1`,
  `public class TreeNode<T> {
    private T data;
    private TreeNode<T> left;
    private TreeNode<T> right;
    
    public TreeNode(T data) {
        this.data = data;
        this.left = null;
        this.right = null;
    }
    
    public void insert(T value) {
        if (((Comparable<T>) data).compareTo(value) > 0) {
            if (left == null) {
                left = new TreeNode<>(value);
            } else {
                left.insert(value);
            }
        } else {
            if (right == null) {
                right = new TreeNode<>(value);
            } else {
                right.insert(value);
            }
        }
    }
}`,
  `public class ThreadPool {
    private final BlockingQueue<Runnable> taskQueue;
    private final List<WorkerThread> threads;
    private boolean isShutdown;
    
    public ThreadPool(int numThreads) {
        taskQueue = new LinkedBlockingQueue<>();
        threads = new ArrayList<>();
        isShutdown = false;
        
        for (int i = 0; i < numThreads; i++) {
            WorkerThread thread = new WorkerThread();
            thread.start();
            threads.add(thread);
        }
    }
    
    public void submit(Runnable task) {
        if (!isShutdown) {
            taskQueue.offer(task);
        }
    }
}`,
  `template<typename T>
class LockFreeQueue {
private:
    struct Node {
        T data;
        std::atomic<Node*> next;
        Node(const T& val) : data(val), next(nullptr) {}
    };
    
    std::atomic<Node*> head;
    std::atomic<Node*> tail;

public:
    LockFreeQueue() {
        Node* dummy = new Node(T());
        head.store(dummy);
        tail.store(dummy);
    }
    
    void push(const T& value) {
        Node* new_node = new Node(value);
        while (true) {
            Node* last = tail.load();
            Node* next = last->next.load();
            if (last == tail.load()) {
                if (next == nullptr) {
                    if (last->next.compare_exchange_weak(next, new_node)) {
                        tail.compare_exchange_weak(last, new_node);
                        return;
                    }
                } else {
                    tail.compare_exchange_weak(last, next);
                }
            }
        }
    }
};`,
  `class NetworkManager {
    std::vector<Connection> connections;
    std::mutex connectionMutex;
    
public:
    void processPackets() {
        for (auto& conn : connections) {
            if (conn.hasData()) {
                Packet packet = conn.receive();
                std::thread([&]() {
                    processPacket(packet);
                }).detach();
            }
        }
    }
    
    void processPacket(const Packet& packet) {
        // Process packet data
        std::lock_guard<std::mutex> lock(connectionMutex);
        // Update connection state
    }
};`,
  `class RubyGraph
    def initialize
        @vertices = {}
    end

    def add_edge(from, to, weight)
        @vertices[from] ||= {}
        @vertices[to] ||= {}
        @vertices[from][to] = weight
        @vertices[to][from] = weight
    end

    def dijkstra(source)
        distances = {}
        @vertices.keys.each { |vertex| distances[vertex] = Float::INFINITY }
        distances[source] = 0
        unvisited = @vertices.keys.to_set

        while unvisited.any?
            current = unvisited.min_by { |vertex| distances[vertex] }
            break if distances[current] == Float::INFINITY
            unvisited.delete(current)

            @vertices[current].each do |neighbor, weight|
                next unless unvisited.include?(neighbor)
                new_distance = distances[current] + weight
                distances[neighbor] = new_distance if new_distance < distances[neighbor]
            end
        end
        distances
    end
end`,
  `#[derive(Debug)]
struct LockFreeStack<T> {
    head: AtomicPtr<Node<T>>,
}

impl<T> LockFreeStack<T> {
    pub fn new() -> Self {
        LockFreeStack {
            head: AtomicPtr::new(std::ptr::null_mut()),
        }
    }

    pub fn push(&self, value: T) {
        let new_node = Box::into_raw(Box::new(Node {
            data: value,
            next: AtomicPtr::new(std::ptr::null_mut()),
        }));

        loop {
            let current_head = self.head.load(Ordering::Relaxed);
            unsafe {
                (*new_node).next.store(current_head, Ordering::Relaxed);
            }
            
            if self.head.compare_exchange(
                current_head,
                new_node,
                Ordering::Release,
                Ordering::Relaxed,
            ).is_ok() {
                break;
            }
        }
    }
}`,
  `type ConcurrentMap struct {
    sync.RWMutex
    items map[string]interface{}
}

func NewConcurrentMap() *ConcurrentMap {
    return &ConcurrentMap{
        items: make(map[string]interface{}),
    }
}

func (m *ConcurrentMap) Set(key string, value interface{}) {
    m.Lock()
    defer m.Unlock()
    m.items[key] = value
}

func (m *ConcurrentMap) Get(key string) (interface{}, bool) {
    m.RLock()
    defer m.RUnlock()
    value, exists := m.items[key]
    return value, exists
}`,
  `sealed class Result<out T> {
    data class Success<T>(val data: T) : Result<T>()
    data class Error(val exception: Exception) : Result<Nothing>()
}

suspend fun <T> safeApiCall(
    apiCall: suspend () -> T
): Result<T> = try {
    Result.Success(apiCall.invoke())
} catch (e: Exception) {
    Result.Error(e)
}

class UserRepository(
    private val api: UserApi,
    private val db: UserDatabase
) {
    suspend fun getUser(id: String): User {
        return when (val result = safeApiCall { api.getUser(id) }) {
            is Result.Success -> {
                db.saveUser(result.data)
                result.data
            }
            is Result.Error -> db.getUser(id) 
                ?: throw result.exception
        }
    }
}`,
  `trait Monad[F[_]] {
  def pure[A](a: A): F[A]
  def flatMap[A, B](fa: F[A])(f: A => F[B]): F[B]
  
  def map[A, B](fa: F[A])(f: A => B): F[B] =
    flatMap(fa)(a => pure(f(a)))
}

case class State[S, A](run: S => (S, A)) {
  def map[B](f: A => B): State[S, B] =
    State { s =>
      val (s1, a) = run(s)
      (s1, f(a))
    }
    
  def flatMap[B](f: A => State[S, B]): State[S, B] =
    State { s =>
      val (s1, a) = run(s)
      f(a).run(s1)
    }
}`,
  `data Tree a = Empty | Node a (Tree a) (Tree a)

foldTree :: (a -> b -> b) -> b -> Tree a -> b
foldTree _ acc Empty = acc
foldTree f acc (Node x left right) =
    let leftResult = foldTree f acc left
        rightResult = foldTree f leftResult right
    in f x rightResult

treeToList :: Tree a -> [a]
treeToList = foldTree (:) []

mapTree :: (a -> b) -> Tree a -> Tree b
mapTree _ Empty = Empty
mapTree f (Node x left right) =
    Node (f x) (mapTree f left) (mapTree f right)`,
  `template<typename T, typename... Rest>
struct are_same : std::false_type {};

template<typename T>
struct are_same<T> : std::true_type {};

template<typename T, typename U, typename... Rest>
struct are_same<T, U, Rest...>
    : std::integral_constant<bool,
        std::is_same<T, U>::value && are_same<U, Rest...>::value>
{};

template<typename T>
class SharedPtr {
    template<typename U>
    friend class SharedPtr;

    T* ptr;
    std::atomic<size_t>* refCount;

public:
    template<typename U>
    SharedPtr(const SharedPtr<U>& other) noexcept
        : ptr(other.ptr)
        , refCount(other.refCount)
    {
        if (refCount) {
            refCount->fetch_add(1, std::memory_order_relaxed);
        }
    }
};`
]

export default function Component({ 
  messages,
  setMessages,
  onCommand, 
  onMinimize = () => {}, 
  onMaximize = () => {}, 
  onClose = () => {}, 
  isProcessing: externalIsProcessing = false 
}: ChatInterfaceProps) {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatboxRef = useRef<HTMLDivElement>(null)
  const [codeMessages, setCodeMessages] = useState<string[]>([])
  const [isMaximized, setIsMaximized] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [contentVisible, setContentVisible] = useState(true)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const [typewriterText] = useTypewriter({
    words: ['SEC TERMINAL: Type /help to get started or just type your message'],
    loop: 1,
    typeSpeed: 20,
  })

  const scrollToBottom = () => {
    if (messagesEndRef.current && chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: messagesEndRef.current.offsetTop,
        behavior: 'smooth'
      })
    }
  }

  const scrollCodeToBottom = () => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    scrollCodeToBottom()
  }, [codeMessages])

  // Code generation effect
  useEffect(() => {
    let currentAnimation: NodeJS.Timeout | null = null
    let isAnimating = false

    function animate() {
      if (isAnimating) return

      try {
        isAnimating = true
        const randomSnippet = CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)]
        let currentIndex = 0

        currentAnimation = setInterval(() => {
          if (currentIndex >= randomSnippet.length) {
            if (currentAnimation) clearInterval(currentAnimation)
            isAnimating = false
            setCodeMessages(prev => {
              const newMessages = [...prev]
              if (newMessages.length > 4) {
                return newMessages.slice(-4) // Only keep last 4 messages
              }
              return newMessages
            })
            setTimeout(animate, 75)
            return
          }

          currentIndex += 2
          setCodeMessages(prev => {
            const newMessages = [...prev]
            newMessages[newMessages.length - 1] = randomSnippet.slice(0, currentIndex)
            return newMessages
          })
        }, 7.5)

        setCodeMessages(prev => [...prev, ''])
      } catch (error) {
        console.error('Animation error:', error)
        cleanup()
        setTimeout(animate, 100)
      }
    }

    function cleanup() {
      if (currentAnimation) {
        clearInterval(currentAnimation)
        currentAnimation = null
      }
      isAnimating = false
    }

    animate()

    return () => {
      cleanup()
    }
  }, [])

  // Update command handling
  const commonCommands = ['help', 'telegram', 'twitter', 'chart', 'iteration', 'stream'] as const;
  type Command = typeof commonCommands[number];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    try {
        setIsProcessing(true);
        const trimmedInput = input.trim().toLowerCase();
        
        
        // Check if input starts with / and is a command
        if (trimmedInput.startsWith('/')) {
            const commandWithoutSlash = trimmedInput.slice(1); // Remove the /
            if (commonCommands.includes(commandWithoutSlash as Command)) {
                setMessages(prev => [...prev, { role: 'user', content: input }]);
                setInput('');
                onCommand(commandWithoutSlash);
                setIsProcessing(false);
                return;
            }
        }

        // If not a command, proceed with LLM+TTS flow
        const newMessage = { role: 'user' as const, content: input };
        setMessages(prev => [...prev, newMessage]);
        setInput('');

        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: [...messages, newMessage] }),
        });

        if (!response.ok) throw new Error('Failed to get response');

        // Read the stream and collect full response
        const reader = response.body?.getReader();
        if (!reader) throw new Error('No reader available');

        let fullResponse = '';
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const text = new TextDecoder().decode(value);
            fullResponse += text;
        }


        // Process TTS before showing response
        if (fullResponse.trim()) {
            try {
                const ttsResult = await textToSpeech(
                    fullResponse,
                    process.env.NEXT_PUBLIC_TOPMEDIAI_VOICE_ID || ''
                );

                if (ttsResult?.audio_url) {
                    // Create audio element and set up event listeners
                    const audio = new Audio();
                    audio.addEventListener('loadstart', () => {});
                    audio.addEventListener('canplaythrough', () => {});
                    audio.addEventListener('playing', () => {});
                    audio.addEventListener('ended', () => {});
                    audio.addEventListener('error', (e) => {});

                    // Set source and load
                    audio.src = ttsResult.audio_url;
                    await audio.load();

                    // Start playing audio
                    await audio.play();

                    // Add initial empty assistant message
                    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

                    // Stream text character by character
                    const chars = fullResponse.split('');
                    const timePerChar = (audio.duration * 1000) / chars.length;
                    let displayedText = '';
                    
                    for (let i = 0; i < chars.length; i++) {
                        await new Promise(resolve => setTimeout(resolve, timePerChar * 0.8));
                        displayedText += chars[i];
                        setMessages(prev => [
                            ...prev.slice(0, -1),
                            { role: 'assistant', content: displayedText }
                        ]);
                    }

                    // Ensure final text is complete
                    setMessages(prev => [
                        ...prev.slice(0, -1),
                        { role: 'assistant', content: fullResponse.trim() }
                    ]);
                }
            } catch (error) {
                console.error('🎤 TTS Error:', error);
                // If TTS fails, show message with smooth streaming
                setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
                const chars = fullResponse.split('');
                let displayedText = '';
                
                for (let i = 0; i < chars.length; i++) {
                    await new Promise(resolve => setTimeout(resolve, 20));
                    displayedText += chars[i];
                    setMessages(prev => [
                        ...prev.slice(0, -1),
                        { role: 'assistant', content: displayedText }
                    ]);
                }
            }
        }

    } catch (error) {
    } finally {
        setIsProcessing(false);
    }
  };

  const handleMaximize = () => {
    if (isMinimized) {
      setIsMinimized(false)
    }
    setIsMaximized(!isMaximized)
    onMaximize()
  }

  const handleMinimize = () => {
    if (isMaximized) {
      setIsMaximized(false)
    }
    setIsMinimized(!isMinimized)
    setContentVisible(!contentVisible)
    onMinimize()
  }

  const handleClose = () => {
    // Add close animation before calling the handler
    const chatWindow = document.querySelector('.chat-window')
    chatWindow?.classList.add('close-animation')
    setTimeout(() => {
      onClose()
    }, 300)
  }

  return (
    <div 
      className={`
        chat-window
        flex flex-col
        transition-all duration-300 ease-in-out
        ${isMaximized ? 
          'fixed inset-4 m-auto rounded-lg z-50' : 
          'w-full max-w-[56rem] rounded-lg'
        }
        ${isMinimized ?
          'fixed top-1 h-[4rem] left-1/2 -translate-x-1/2' :
          'relative h-[70vh]'
        }
        bg-[#0D0208] overflow-hidden font-mono text-[#00ff41] 
        shadow-[0_0_20px_rgba(0,255,0,0.5)] border border-[#00ff41]
      `}
    >
      <div className="bg-black bg-opacity-50 px-4 py-2 flex flex-col items-center justify-center">
        <div className="flex w-full justify-between items-center mb-2">
          <div className="flex space-x-2">
            <button 
              onClick={handleClose}
              className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-600 transition-colors duration-150 flex items-center justify-center group"
              aria-label="Close"
            >
              <span className="hidden group-hover:inline text-black text-xs">×</span>
            </button>
            <button 
              onClick={handleMinimize}
              className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-600 transition-colors duration-150 flex items-center justify-center group"
              aria-label="Minimize"
            >
              <span className="hidden group-hover:inline text-black text-xs">−</span>
            </button>
            <button 
              onClick={handleMaximize}
              className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-600 transition-colors duration-150 flex items-center justify-center group"
              aria-label="Maximize"
            >
              <span className="hidden group-hover:inline text-black text-xs">+</span>
            </button>
          </div>
        </div>
        {!isMinimized && (
          <div className="w-full flex justify-center">
            <pre className="text-[#00ff41] text-center mb-4 text-[0.25rem] sm:text-[0.35rem] md:text-[0.5rem] lg:text-[0.7rem] font-mono leading-[0.7] sm:leading-[0.8] md:leading-[0.9] lg:leading-[1] whitespace-pre inline-block">
{`
████████╗███████╗██████╗ ███╗   ███╗██╗███╗   ██╗ █████╗ ██╗     
╚══██╔══╝██╔════╝██╔══██╗████╗ ████║██║████╗  ██║██╔══██╗██║     
   ██║   █████╗  ██████╔╝██╔████╔██║██║██╔██╗ ██║███████║██║     
   ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║██║██║╚██╗██║██╔══██║██║     
   ██║   ███████╗██║  ██║██║ ╚═╝ ██║██║██║ ╚████║██║  ██║███████╗
   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝


`.trim()}
            </pre>
          </div>
        )}
      </div>
      {!isMinimized && (
        <>
          <div className="flex-1 overflow-hidden p-2 sm:p-4 relative bg-transparent">
            <div 
              ref={chatboxRef}
              className="absolute inset-0 overflow-y-auto opacity-10 pointer-events-none p-2 sm:p-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] bg-transparent"
            >
              <div className="flex flex-col gap-2">
                {codeMessages.map((msg, index) => (
                  <pre key={index} className="text-[#00ff41] whitespace-pre-wrap break-words text-xs sm:text-sm md:text-base">
                    {msg}
                  </pre>
                ))}
              </div>
            </div>
            
            <div 
              ref={chatContainerRef}
              className="relative z-10 h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] bg-transparent"
            >
              <div className="space-y-2 sm:space-y-4">
                <div className="text-[#00FF00] text-sm sm:text-base md:text-lg font-bold">
                  {typewriterText}<Cursor />
                </div>
                {messages.map((message, index) => (
                  <div key={index} className={`${message.role === 'user' ? 'text-[#00ff41]' : 'text-[#00FF00]'} text-xs sm:text-sm md:text-base`}>
                    <span className="font-bold">{message.role === 'user' ? '> ' : 'SEC TERMINAL: '}</span>
                    <pre className="inline whitespace-pre-wrap font-mono">{message.content}</pre>
                  </div>
                ))}
                {isProcessing && (
                  <div className="text-[#00FF00] text-xs sm:text-sm md:text-base">
                    <span className="font-bold">SEC TERMINAL: </span>
                    Regulating<Cursor />
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          </div>

          <form 
            onSubmit={handleSubmit} 
            className="p-2 sm:p-4 border-t border-[#00ff41] bg-black bg-opacity-50"
          >
            <div className="flex items-center">
              <span className="text-[#00ff41] mr-2">{'>'}</span>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-transparent text-[#00ff41] focus:outline-none min-h-[14px] text-xs sm:text-sm md:text-base"
                placeholder="type here"
                disabled={isLoading}
              />
            </div>
          </form>
        </>
      )}
    </div>
  )
}