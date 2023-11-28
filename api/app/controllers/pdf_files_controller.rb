class PdfFilesController < ApplicationController
    def show
        # Replace 'path/to/your/pdf.pdf' with the actual path to your PDF file.
        send_file '/home/user/Downloads/ComputerScienceTimetable.pdf', type: 'application/pdf', disposition: 'inline'
      end
end
