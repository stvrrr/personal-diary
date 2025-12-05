export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} Nice Diaries. All rights reserved.
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Created by Name Unknown
          </p>
        </div>
      </div>
    </footer>
  );
}
