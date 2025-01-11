const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6">
        <img src='p.png' className="w-8 h-8 text-blue-500" />
      </div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-3">Chat 0sm</h2>
      <p className="text-gray-600 max-w-md mb-6">
        Begin your chat by typing a message below.
      </p>
      <div className="p-4 bg-blue-50 rounded-lg text-sm text-blue-700">
        Try asking about a specific topic or request assistance with a task
      </div>
    </div>
  );
};

export default EmptyState;