const UserStats = () => {
    return (
      <div className="bg-white dark:bg-zinc-800 mr-6 rounded-lg border py-4 px-6 mt-5">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Your Activity</h3>
  
        <div className="mt-3 space-y-2 text-sm text-gray-500 dark:text-gray-300">
          <p><span className="font-medium text-gray-900 dark:text-white">Connections:</span> 123</p>
          <p><span className="font-medium text-gray-900 dark:text-white">Likes Received:</span> 456</p>
          <p><span className="font-medium text-gray-900 dark:text-white">Top Post:</span> Why Networking is the Future!</p>
          <p><span className="font-medium text-gray-900 dark:text-white">Top Comment:</span> Networking is the key to success!</p>
          <p><span className="font-medium text-gray-900 dark:text-white">Top Post Likes:</span> 789</p>
        </div>
      </div>
    );
  };  
  export default UserStats;