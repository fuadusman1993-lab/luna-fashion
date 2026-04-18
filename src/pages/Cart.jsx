export default function Cart() {
  return (
    <div className="min-h-[70vh] bg-gray-50 dark:bg-black px-4 py-8 flex flex-col items-center justify-center text-center">
       <div className="w-20 h-20 bg-gray-200 dark:bg-gray-900 rounded-full flex flex-col items-center justify-center mb-6">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
       </div>
       <h2 className="text-lg font-bold text-luna-black dark:text-white mb-2">Your cart is empty</h2>
       <p className="text-sm text-gray-500 mb-8 max-w-[250px] mx-auto">There are no items in your shopping cart right now. Add some luxury pieces.</p>
       <button className="bg-luna-black dark:bg-gold text-white dark:text-black font-semibold uppercase tracking-wider py-3 px-10 text-xs rounded-sm hover:opacity-90">
          Start Shopping
       </button>
    </div>
  )
}
